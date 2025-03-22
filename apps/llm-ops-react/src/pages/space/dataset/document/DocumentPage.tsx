import DatasetInfo from './components/DatasetInfo';
import DocAction from './components/DocAction';

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
