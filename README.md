# sv

## TODO
- [ ] Create course management view
  - [x] CRUD
  - [x] Assign lesson to course
  - [x] Manage course sections
  - [ ] Reorder lessons within course and its sections
- [x] Create lesson management view
  - [x] CRUD
  - [x] Specify lesson type to be displayed on course screen
- [ ] Create public courses view 
  - [ ] Sort/Filter courses
  - [ ] Allow users to preview free lessons in course
  - [ ] For protected lessons redirect to purchase page



## Terminal

- [x] Add Cover image
- [ ] Enroll user modal
- [x] Add dialog to link lessons
  - [x] Finish lesson linking
- [x] Add select to change course owner courseOwnerId
- [ ] Display list of enrolled users
- [ ] Display price history
- [ ] The overview list should show propperly styled status
- [ ] The overview should display the featured status
- [x] The list should display the owner
- [x] The list should display the published date
- [x] Propper metadata section including the Updated By and Created By
- [ ] User list filtered to eligible users only

- 
## Authentication
- [ ] User without purchased course cannot view protected lessons
- 
- 
- 
- 
- 
- 
- 
- 
- 
- 
- [x] Implement custom confirmation modal service which will alow me to trigger actions for user confirmation. Should have variuants like Confirm | success | warning | error | infor
- [x] Implement toas notification that will have following
  - [x] To be dismissed
  - [x] Has timer until it disappears or stays forever based on the type
  - [x] they are stacked newest -> oldest
  - [x] has global setting to be placed top right/left/center bottom right/left/center
  - [x] has different style based on the type of notification Success / Warning / Error / Info / Default
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
- [x] Admin/User Login
  - [x] Make security work
  - [x] Only users with specific right can access the dashboard
  - [x] Handle cookies and data storing 
- [ ] Correct icon display on in the UniversalDataTable
- [x] Fix date format in the Data table
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
