import { Crud, DataModel, DataSource } from "@toolpad/core";
import pathsRouter from "../router/paths.router";

const dataSource: DataSource<DataModel> = {
  fields: [],
  getMany: () => ({ items: [], itemCount: 0 }),
};

export default function SettingsPage() {
  return <Crud dataSource={dataSource} rootPath={pathsRouter.settings} />;
}
