export default /* GraphQL */ `
  extend type Query {
    getGForms: Forms
    getGForm(id: Int!): Form
    getEntriesGform(page: Int!, perPage: Int!, formId: Int!): Entries
    getTotalEntriesGform(formId: Int!): Int!
    getGFormViews(formId: Int!): Int!
    getEntryGform(id: Int!): Entry
    getGFormConfirmations(id: Int!): String!
    getGFormConfirmation(id: String!, formId: Int!): String!
    getGFormNotifications(id: Int!): String!
    getGFormNotification(id: String!, formId: Int!): String!
  }

  extend type Mutation {
    addGForm(title: String!, data: String!): SuccessData!
    addGFormView(formId: Int!): SuccessData!
    updateGForm(id: Int!, title: String!, data: String!, description: String): SuccessData!
    updateGFormActive(id: Int!, active: Boolean!): SuccessData!
    addEntryGForm(id: Int!, postId: Int!, values: String!): SuccessData!
    deleteEntriesGForm(ids: [Int!]): SuccessData!
    addGFormConfirmation(
      id: Int!
      confirmationName: String!
      confirmationType: String!
      message: String
      page: Int
      redirectUrl: String
      passData: String
    ): SuccessData!
    updateGFormConfirmation(
      id: String!
      formId: Int!
      confirmationName: String!
      confirmationType: String!
      message: String
      page: Int
      redirectUrl: String
      passData: String
    ): SuccessData!
    deleteGFormConfirmation(id: String!, formId: Int!): SuccessData!
    addGFormNotification(
      id: Int!
      notificationName: String!
      notificationSendTo: String!
      sendToEmail: String
      emailFieldId: String
      fromName: String
      fromEmail: String
      replyTo: String
      bcc: String
      subject: String
      message: String
    ): SuccessData!
    updateGFormNotification(
      id: String!
      formId: Int!
      notificationName: String!
      notificationSendTo: String!
      sendToEmail: String
      emailFieldId: String
      fromName: String
      fromEmail: String
      replyTo: String
      bcc: String
      subject: String
      message: String
    ): SuccessData!
    deleteGFormNotification(id: String!, formId: Int!): SuccessData!
    deleteGForm(formId: Int!): SuccessData!
  }

  type Entries {
    entries: [Entry]
    total: Int!
  }

  type Entry {
    id: Int!
    form_id: Int!
    post_id: Int!
    date_created: String
    date_updated: String
    data: String
    form_title: String
  }

  type Forms {
    forms: [Form]
    total: Int!
  }

  type Form {
    id: Int!
    title: String!
    description: String
    slug: String!
    entries: Int!
    views: Int!
    conversion: Float!
    fields: Fields!
    status: String!
    confirmations: String
    notifications: String
  }

  type Fields {
    fields: [Field]
    total: Int!
  }

  type Field {
    id: String
    type: String
    label: String
    defaultValue: String
    description: String
    required: Boolean
    content: String
    dateFormat: String
    addressFields: AddressFields
    choices: [Choices]
    conditionals: [Conditionals]
    conditionalsEnabled: Boolean
    conditionalsShow: String
    conditionalsMatch: String
  }

  type Conditionals {
    id: String
    fieldId: String
    field: String
    finder: String
    value: String
    choice: String
  }

  type Choices {
    id: String
    value: String
  }

  type AddressFields {
    street_address: Boolean
    address_line_2: Boolean
    city: Boolean
    county: Boolean
    postcode: Boolean
    country: Boolean
    street_addressLabel: String
    address_line_2Label: String
    cityLabel: String
    countyLabel: String
    postcodeLabel: String
    countryLabel: String
  }
`;
