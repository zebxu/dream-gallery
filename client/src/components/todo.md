### Back-End

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
- [ ] Dynamic Navbar
- [ ] Redux refacotr, reduce api calls

### Deployment

- [ ] Deploy Node server to Heroku as service
- [ ] Deploy production frontend to Github Page

---

`shoulComponentUpdate(nextProps, nextState)`

Return true by default - update whenever props or state change
Prevent default update behavior by overwrite the lifecycle

`componentDidUpdate(prevProps, prevState, snapshot)`

Perform a side-effect (fetching data) in terms of props or state change
