export default /* GraphQL */ `
  extend type Query {
    getAccordions: Accordions
    getAccordion(id: Int!): Accordion
  }
  extend type Mutation {
    addAccordion(title: String!, data: String!): SuccessData!
    updateAccordion(id: Int!, title: String!, data: String!): SuccessData!
    updateAccordionActive(id: Int!, active: Boolean): SuccessData!
    deleteAccordion(id: Int!): SuccessData!
  }

  type Accordions {
    accordions: [Accordion]
    total: Int!
  }

  type Accordion {
    id: Int!
    title: String!
    fields: Fields!
    status: String!
  }

  type Fields {
    fields: [Field]
    total: Int!
  }

  type Field {
    id: String
    title: String
    content: String
  }
`;
