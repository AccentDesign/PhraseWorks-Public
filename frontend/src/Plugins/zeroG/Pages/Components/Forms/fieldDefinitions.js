const fieldDefinitions = [
  {
    type: 'text',
    definition: `Single Line Text
      Allows users to submit a single line of text.
    `,
  },
  {
    type: 'textarea',
    definition: `Paragraph Text
    Allows users to submit multiple lines of text.
    `,
  },
  {
    type: 'number',
    definition: `Number
    Allows users to enter a number.
    `,
  },
  {
    type: 'hidden',
    definition: `Hidden
    Stores information that should not be visible to the user but can be processed and saved with the user submission.
    `,
  },
  {
    type: 'dropdown',
    definition: `Drop Down
    Allows users to select one option from a list.
    `,
  },
  {
    type: 'checkbox',
    definition: `Checkboxes
    Allows users to select one or many checkboxes.
    `,
  },
  {
    type: 'radio',
    definition: `Radio Buttons
    Allows users to select one option from a list.
    `,
  },
  {
    type: 'html',
    definition: `HTML
    Places a block of free form HTML anywhere in your form.
    `,
  },
  {
    type: 'name',
    definition: `Name
    Allows users to enter their name in the format you have specified.
    `,
  },
  {
    type: 'section',
    definition: `Section
    Adds a content separator to your form to help organize groups of fields. This is a visual element and does not collect any data.
    `,
  },
  {
    type: 'date',
    definition: `Date
    Allows users to enter a date.
    `,
  },
  {
    type: 'time',
    definition: `Time
    Allows users to submit a time as hours and minutes.
    `,
  },
  {
    type: 'phone',
    definition: `Phone
    Allows users to enter a phone number.
    `,
  },
  {
    type: 'address',
    definition: `Address
    Allows users to enter a physical address.
    `,
  },
  {
    type: 'website',
    definition: `Website
    Allows users to enter a website URL.
    `,
  },
  {
    type: 'email',
    definition: `Email
    Allows users to enter a valid email address.
    `,
  },
  {
    type: 'upload',
    definition: `File Upload
    Allows users to upload a file.
    `,
  },
];

export default fieldDefinitions;
