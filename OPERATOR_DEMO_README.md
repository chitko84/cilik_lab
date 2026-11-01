# CilikLab Operator View — browser demo

This build has three **demo roles**: Student, Teacher and Operator. Switch directly from the top bar (mobile: profile menu). No operator account, password, Redis service, or special API server is needed to explore Operator View.

- Open the website and select **Operator View**, or load `http://localhost:3000/?role=operator`.
- The Operator sidebar has Overview, User Management, Academic Operations, Platform Management, Monitoring and Account groups, with every page independently accessible.
- Operator pages include fictional Students, Teachers, Classes, Schedules, Content, Support and Moderation records; you can search, filter, add, edit and remove sample records.
- The dashboard, reports and activity log update based on edits to demo records.
- All edits are saved to **this browser's localStorage only** (`ciliklab_operator_browser_demo_v1`). Use **Demo Settings > Restore sample records** to reset them.
- The UI is expressly labeled **Sample data only** and **does not** authenticate users, authorize administrative access, affect real student/teacher accounts, or synchronize records to a server.
- This is a judge/demo presentation feature, **not** a production admin console. Real operator functionality would require server-side authorization and a persistent shared database.

## RoboLab judges' demo

All 8 worlds and 40 missions are open without prerequisite completions. Star ratings and completed levels remain tracked separately and are not automatically marked finished.

To re-enable normal mission progression later, set:

`src/pages/arcade/robolab/demoConfig.ts` → `ROBOLAB_DEMO_UNLOCK_ALL = false`.

## Running locally

```
npm install
npm run dev
```

No second server is needed for the Operator demo. The existing separate Telegram/hosted-meeting backend is still optional and unrelated to Operator View.

## Operator reports and larger sample directory (1 Nov 2026 update)

- The long introductory “Judge demonstration mode” notice has been removed from the dashboard. The concise `Sample data only` label remains, so fictional records are not mistaken for real learner information.
- **Students:** 32 fictional profiles by default (previously 5); **Teachers:** 14 fictional profiles (previously 4). Both lists remain searchable, editable and filterable.
- **Reports & Analytics:** Ten data-driven charts for student/teacher status, student pathways, student levels, teacher specialties, class enrollment, learning content publication, support requests, community moderation and records by platform area. Charts update when you add/edit/delete the corresponding demo records.
- Existing demo browsers are upgraded automatically to the expanded directory. Previously edited rows and activity logs are preserved; added records are inserted only once. The operator storage key has not changed.
- Use **Demo Settings → Restore sample records** to return to the expanded default dataset.
- Test just this upgrade with `npm run test:operator:analytics`. The existing `npm run test:operator` and `npm run test:robolab` are still available.

The operator data is entirely fictional. No real account access, production analytics or shared server data is enabled.
