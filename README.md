# sv

## TOD
- [ ] Implement custom confirmation modal service which will alow me to trigger actions for user confirmation. Should have variuants like Confirm | success | warning | error | infor
- [ ] Implement toas notification that will have following
  - [ ] To be dismissed
  - [ ] Has timer until it disappears or stays forever based on the type
  - [ ] they are stacked newest -> oldest
  - [ ] has global setting to be placed top right/left/center bottom right/left/center
  - [ ] has different style based on the type of notification Success / Warning / Error / Info / Default
  - [ ] there should be a global option to turn on debug mode - in this mode the notifications log addiotional information (for example the full HTTP response received)
  - [ ] each notification should have an Icon, Heading and sub-heading - optionally can contain a special link
- [ ] Implement custom FORM input types that can be placed using FormBuilder
- [ ] Move the Export CSV logic to UniversalDataTable (utils)
- [ ] Make the link FAQ to category form working again
- [ ] Make the form style more coherent and unified
- [ ] Fix the form colapsed height issue
- [ ] UniversalDataTable
  - [ ] Sortable columns
  - [ ] Working filters
- [ ] Admin/User Login
  - [ ] Make security work
  - [ ] Only users with specific right can access the dashboard
  - [ ] Handle cookies and data storing 
  - 



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
