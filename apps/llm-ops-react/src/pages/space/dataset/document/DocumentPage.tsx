import DocAction from './components/DocAction';
import DatasetInfo from './components/DatasetInfo';

const DocumentPage = () => {
  return (
    <div className="h-screen px-3">
      <header className="py-4">
        <DatasetInfo />
      </header>
      <div className="py-2">
        <DocAction />
      </div>
    </div>
  );
};

export default DocumentPage;
