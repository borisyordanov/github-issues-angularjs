```html
<github-app infinite-scroller>
    <github-repo-selecter repos="" on-repo-select=""></github-repo-selecter>

    <github-repo-stats repo=""></github-repo-stats>

    <github-issues-toolbar on-toolbar-select="">
        <github-issues-filter on-filter-by=""></github-issues-filter>
        <github-issues-sort on-sort-by=""></github-issues-sort>
    </github-issues-toolbar>

    <github-issue-listing issues="">
        <github-issue issue="">
            <p>Title</p>
            <p>Comments</p>
            <p>Details <relative-time></relative-time> by ...</p>
        </github-issue>
    </github-issue-listing>
</github-app>
```
