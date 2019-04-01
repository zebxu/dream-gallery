### Back-End

- [x] refactor rest api
- [ ] Authentication

### Front-End

- [x] fix back button function
- [x] implement search component
- [x] fix menu item in mobile query
- [x] create saved page component
- [x] scroll to top when change page
- [x] implement save button
- [x] implement unsave button on favorite page
- [ ] ~~refresh after save button is clicked~~
- [x] debug saved button view
- [x] implement unsave on favorite page
- [x] connect to Node.js server
- [x] save button on movie page
- [x] restore scroll position
- [x] Favorite pagenation
- [x] Impove Node api
- [x] Favorite movie date
- [x] Different favorite list
- [x] Dynamic Navbar
- [x] Search, no movie is found
- [x] 404 not found page route
- [ ] ~~Open new tab when click a movie link~~
- [x] Movie page favorite button
- [x] Blur after search input submit
- [x] Fix search on search result page
- [x] Keyword link to search
- [ ] Dynamic search recommendation
- [x] Favorite preview video on hover
- [ ] Redux refacotr, reduce api calls, caching
- [x] Render movie page using template engine and Node.js
- [x] Save button not refresh the whole page
- [x] movie page and favorite page save button loading
- [ ] improve favorite page on mobile
- [ ] Fix saved movie invalid date

### Deployment

- [x] Deploy app to Heroku
- [x] Seperate movie page as a decoupled app
- [ ] ~~Deploy production frontend to Github Page~~

---

`shoulComponentUpdate(nextProps, nextState)`

Return true by default - update whenever props or state change
Prevent default update behavior by overwrite the lifecycle

`componentDidUpdate(prevProps, prevState, snapshot)`

Perform a side-effect (fetching data) in terms of props or state change
