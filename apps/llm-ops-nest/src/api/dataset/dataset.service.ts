import { Injectable, NotFoundException } from '@nestjs/common';
import {
  GetDatasetPaginationReq,
  GetDatasetPaginationRes,
  GetDatasetRes,
} from '@repo/lib-api-schema';
import { Prisma } from '@repo/lib-prisma';
import { PrismaService } from '../../common/prisma/prisma.service';
import { calculatePagination } from '../../common/util/pagination.util';

const DEFAULT_DATASET_DESCRIPTION_FORMATTER =
  '当你需要回答关于《{name}》的时候可以引用该知识库。';

@Injectable()
export class DatasetService {
  constructor(private readonly prisma: PrismaService) {}

  async findDatasetByName(name: string, accountId: string) {
    return this.prisma.dataset.findUnique({
      where: {
        uk_dataset_account_id_name: {
          accountId,
          name,
        },
      },
    });
  }

  async isNameExists(name: string, accountId: string) {
    const dataset = await this.findDatasetByName(name, accountId);
    return !!dataset;
  }

  async isNameExistsExceptId(
    name: string,
    accountId: string,
    excludeId: string,
  ) {
    const dataset = await this.findDatasetByName(name, accountId);
    return !!dataset && dataset.id !== excludeId;
  }

  async createDataset(
    accountId: string,
    name: string,
    icon: string,
    description: string | undefined,
  ) {
    const finalDesc =
      description ||
      DEFAULT_DATASET_DESCRIPTION_FORMATTER.replace('{name}', name);

    return this.prisma.dataset.create({
      data: {
        accountId,
        name,
        icon,
        description: finalDesc,
      },
    });
  }

  async getDatasetById(id: string, accountId: string) {
    const dataset = await this.prisma.dataset.findUnique({
      where: {
        id,
        accountId,
      },
    });
    if (!dataset) {
      throw new NotFoundException('知识库不存在');
    }
    return dataset;
  }

  async updateDataset(
    id: string,
    name: string,
    icon: string,
    description: string | undefined,
  ) {
    const finalDesc =
      description ||
      DEFAULT_DATASET_DESCRIPTION_FORMATTER.replace('{name}', name);

    return this.prisma.dataset.update({
      where: {
        id,
      },
      data: {
        name,
        icon,
        description: finalDesc,
      },
    });
  }

  async deleteDataset(id: string) {
    // TODO: delete all documents in the dataset
    // TODO: delete all app dataset relations
    return this.prisma.dataset.delete({
      where: {
        id,
      },
    });
  }

  async getDatasetPagination(
    accountId: string,
    query: GetDatasetPaginationReq,
  ) {
    const { searchWord, ...rest } = query;
    const { param, buildResult } = calculatePagination(rest);
    const where: Prisma.DatasetWhereInput = {
      accountId,
    };

    if (searchWord) {
      where.name = {
        contains: searchWord,
      };
    }

    const datasetsPrisma = this.prisma.dataset.findMany({
      select: {
        id: true,
        name: true,
        icon: true,
        description: true,
        createdAt: true,
        updatedAt: true,
        _count: {
          select: {
            documents: true,
          },
        },
      },
      where,
      ...param,
      orderBy: {
        createdAt: 'desc',
      },
    });

    const totalPrisma = this.prisma.dataset.count({
      where,
    });

    const [datasets, total] = await Promise.all([datasetsPrisma, totalPrisma]);

    const datasetIds = datasets.map((dataset) => dataset.id);
    const documentCharacterCounts = await this.prisma.document.groupBy({
      by: ['datasetId'],
      _sum: {
        characterCount: true,
      },
      where: {
        datasetId: {
          in: datasetIds,
        },
      },
    });

    const list: GetDatasetPaginationRes['list'] = datasets.map((dataset) => {
      return {
        id: dataset.id,
        name: dataset.name,
        icon: dataset.icon,
        description: dataset.description,
        documentCount: dataset._count.documents,
        characterCount:
          documentCharacterCounts.find((item) => item.datasetId === dataset.id)
            ?._sum.characterCount || 0,
        // TODO: get related app count
        relatedAppCount: 0,
        createdAt: dataset.createdAt.getTime(),
        updatedAt: dataset.updatedAt.getTime(),
      };
    });

    return buildResult(list, total);
  }

  async getDatasetDetail(
    id: string,
    accountId: string,
  ): Promise<GetDatasetRes> {
    const datasetPrisma = this.prisma.dataset.findUnique({
      where: {
        id,
        accountId,
      },
    });

    const hitCountPrisma = this.prisma.segment.aggregate({
      _sum: {
        hitCount: true,
      },
      where: {
        datasetId: id,
      },
    });

    const characterCountPrisma = this.prisma.document.aggregate({
      _sum: {
        characterCount: true,
      },
      _count: {
        _all: true,
      },
      where: {
        datasetId: id,
      },
    });

    const [dataset, hitCount, characterCount] = await Promise.all([
      datasetPrisma,
      hitCountPrisma,
      characterCountPrisma,
    ]);

    if (!dataset) {
      throw new NotFoundException('知识库不存在');
    }
    return {
      id: dataset.id,
      name: dataset.name,
      icon: dataset.icon,
      description: dataset.description,
      documentCount: characterCount._count._all,
      hitCount: hitCount._sum.hitCount ?? 0,
      characterCount: characterCount._sum.characterCount ?? 0,
      // TODO: get related app count
      relatedAppCount: 0,
      createdAt: dataset.createdAt.getTime(),
      updatedAt: dataset.updatedAt.getTime(),
    };
  }
}
