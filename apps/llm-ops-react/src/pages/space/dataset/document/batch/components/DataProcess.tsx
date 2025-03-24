// type DataProcessFile = {
//   id: string;
//   name: string;
//   extension: string;
//   size: number;
//   status: 'waiting' | 'processing' | 'success' | 'failed';
//   progress: number;
// };

type Props = {
  fileIds: string[];
};

const DataProcess = ({ fileIds }: Props) => {
  return <div>{fileIds.length}</div>;
};

export default DataProcess;
