# Web Analytics

The portfolio uses Vercel Web Analytics through the script loaded in `index.html`.
It needs no npm package or build step. Local previews and the GitHub Pages mirror
skip the script; visits to the Vercel deployment are tracked automatically.

## View traffic

1. Open [the project's Analytics dashboard](https://vercel.com/rc-odes/raghad-elajab-portfolio/analytics).
2. Select **Production** and a date range.
3. Review visitors, page views, referrers, countries, and devices. Click a panel's
   entries to filter the results.

The portfolio is one page, so section anchors and project dialogs are not
separate page views. This setup collects standard page views, without custom
click events.

## If no data appears

- Visit the [Vercel site](https://raghad-elajab-portfolio.vercel.app), rather than
  the GitHub Pages mirror or localhost.
- Confirm Web Analytics is enabled in the dashboard. If you enable it after a
  deployment, redeploy the project.
- In your browser's Network panel, check that `/_vercel/insights/script.js` loads
  and a POST to `/_vercel/insights/view` succeeds. Ad blockers may block tracking,
  and Vercel skips automated browsers.

References: [Vercel setup](https://vercel.com/docs/analytics/quickstart),
[dashboard guide](https://vercel.com/docs/analytics/using-web-analytics), and
[troubleshooting](https://vercel.com/docs/analytics/troubleshooting).
