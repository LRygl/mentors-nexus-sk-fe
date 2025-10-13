# sv

## TODO
- [x] Implement custom confirmation modal service which will alow me to trigger actions for user confirmation. Should have variuants like Confirm | success | warning | error | infor
- [ ] Implement toas notification that will have following
  - [x] To be dismissed
  - [x] Has timer until it disappears or stays forever based on the type
  - [x] they are stacked newest -> oldest
  - [x] has global setting to be placed top right/left/center bottom right/left/center
  - [x] has different style based on the type of notification Success / Warning / Error / Info / Default
  - [ ] there should be a global option to turn on debug mode - in this mode the notifications log addiotional information (for example the full HTTP response received)
  - [x] each notification should have an Icon, Heading and sub-heading - optionally can contain a special link
- [x] Implement custom FORM input types that can be placed using FormBuilder
- [ ] Move the Export CSV logic to UniversalDataTable (utils)
- [x] Make the link FAQ to category form working again
- [ ] Make the form style more coherent and unified
- [x] Fix the form colapsed height issue
- [ ] UniversalDataTable
  - [x] Sortable columns
  - [x] Default sorting by column (asc/desc)
  - [ ] Working filters
- [ ] Admin/User Login
  - [ ] Make security work
  - [ ] Only users with specific right can access the dashboard
  - [ ] Handle cookies and data storing 
- [ ] Correct icon display on in the UniversalDataTable
- [ ] Fix date format in the Data table
- [ ] FAQ Data table elipsis for extra long answers
  - [ ] FAQ Publish and schedule publish - if scheduled show calendar icon / different color in datetime
  - [ ] Reuse link FAQ Category from the action



## Creating a project

If you're seeing this, you've probably already done this step. Congrats!

```bash
# create a new project in the current directory
npx sv create

# create a new project in my-app
npx sv create my-app
```

## Developing

Once you've created a project and installed dependencies with `npm install` (or `pnpm install` or `yarn`), start a development server:

```bash
npm run dev

# or start the server and open the app in a new browser tab
npm run dev -- --open
```

## Building

To create a production version of your app:

```bash
npm run build
```

You can preview the production build with `npm run preview`.

> To deploy your app, you may need to install an [adapter](https://svelte.dev/docs/kit/adapters) for your target environment.
