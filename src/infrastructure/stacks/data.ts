import { RemovalPolicy, Stack, StackProps } from "aws-cdk-lib";
import { AttributeType, ITable, Table } from "aws-cdk-lib/aws-dynamodb";
import { Construct } from "constructs";
import { getSuffixFromStack } from "../utils";

export class DataStack extends Stack {
  public spacesTable: ITable;

  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    const spacesTable = new Table(this, "SpacesTable", {
      partitionKey: {
        name: "id",
        type: AttributeType.STRING,
      },
      tableName: `SpacesTable-${getSuffixFromStack(this)}`,
      removalPolicy: RemovalPolicy.DESTROY,
    });

    spacesTable.addGlobalSecondaryIndex({
      indexName: "NameIndex",
      partitionKey: {
        name: "name",
        type: AttributeType.STRING,
      },
    });

    this.spacesTable = spacesTable;
  }
}
