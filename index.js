 const express = require('express');
const app = express();
const cors= require("cors");
app.use(express.json());
app.use(cors());
let ADMINS = [];
let USERS = [];
let COURSES = [];


function adminAuthentication(req, res, next){
  const {username, password} = req.headers;
  const isadmin= ADMINS.find(a=> a.username === username && a.password == password);
    if(isadmin){
      next();
    }
    else
    {
      res.status(403).json({messgae: 'admin authentication failed'});
    }
}


const userAuthentication = (req, res, next) => {
  const { username, password } = req.headers;
  const user = USERS.find(u => u.username === username && u.password === password);
  if (user) {
    req.user = user;  // Add user object to the request
    next();
  } else {
    res.status(403).json({ message: 'User authentication failed' });
  }
};


// // Admin routes
//  app.post('/admin/signup', (req, res) => {
//   // logic to sign up admin
//    newadminacc=req.body;
//   if(ADMINS.find(a => a.username ===newadminacc.username)){
//     res.status(403).json('Admin already exists');
//    }
//    else ADMINS.push(newadminacc);
//  });

app.post('/admin/signup', (req, res) => {
  const admin = req.body;
  const existingAdmin = ADMINS.find(a => a.username === admin.username);
  if (existingAdmin) {
    res.status(403).json({messgae: 'Admin already exists'});
  } else {
    ADMINS.push(admin);
    res.json({messgae: 'Admin created successfully'});
  }
});

app.post('/admin/login', adminAuthentication,  (req, res) => {
  // logic to log in admin
  res.json({messgae:'Logged in successfully'} );

  
});

app.post('/admin/courses', adminAuthentication, (req, res) => {
  // logic to create a course
  //const {title, description, price, imageLink, published} = req.body;
  const course = req.body;
  COURSES.push(course);
  course.id= Date.now();
  res.json({message: 'Course created successfully', courseId: course.id});

});

app.put('/admin/courses/:courseId', adminAuthentication, (req, res) => {
  const courseId = parseInt(req.params.courseId);
  const course = COURSES.find(c => c.id === courseId);
  if (course) {
    Object.assign(course, req.body);
    res.json({ message: 'Course updated successfully' });
  } else {
    res.status(404).json({ message: 'Course not found' });
  }
});

app.get('/admin/courses', (req, res) => {
  // logic to get all courses
  res.json({courses: COURSES});
});

// User routes
app.post('/users/signup', (req, res) => {
  // logic to sign up user
 const user = {
    username: req.body.username,
    password: req.body.password,
    purchasedCourses: []
  }
  const userexists= USERS.find(a => a.username === user.username);
  if(userexists){
    res.status(403).json({messgae: 'User already exists'});
  }
  else {USERS.push(user)};
  res.json({message: "user created successfully" });
});


app.post('/users/signup', (req, res) => {
  // const user = {...req.body, purchasedCourses: []};
  const user = {
    username: req.body.username,
    password: req.body.password,
    purchasedCourses: []
  }
  USERS.push(user);
  res.json({ message: 'User created successfully' });
});





app.post('/users/login', userAuthentication, (req, res) => {
  res.json({ message: 'Logged in successfully' });
});


app.get('/users/courses', userAuthentication, (req, res) => {
  // COURSES.filter(c => c.published)
  let filteredCourses = [];
  for (let i = 0; i<COURSES.length; i++) {
    if (COURSES[i].published) {
      filteredCourses.push(COURSES[i]);
    }
  }
  res.json({ courses: filteredCourses });
});

app.post('/users/courses/:courseId', userAuthentication,  (req, res) => {
  // logic to purchase a course
  
  const courseId= Number(req.params.courseId);
  const valid = COURSES.find(c=> c.id=== courseId && c.published);
  if (valid){
    req.user.purchasedCourses.push(courseId);
    res.json({ message: 'Course purchased successfully' });
  }
  else {
    res.status(404).json({ message: 'Course not found or not available' });
  }

});

/*app.post('/users/courses/:courseId', userAuthentication, (req, res) => {
  const courseId = Number(req.params.courseId); 
  const course = COURSES.find(c => c.id === courseId && c.published);
  if (course) {
    req.user.purchasedCourses.push(courseId);
    res.json({ message: 'Course purchased successfully' });
  } 
  else {
    res.status(404).json({ message: 'Course not found or not available' });
  }

});
*/


app.get('/users/purchasedCourses', userAuthentication, (req, res) => {
  // logic to view purchased courses
  var purchasedCoursesIds = req.user.purchasedCourses;
  var purchasedCourses = [];
  for(let i=0; i< COURSES.length ; i++){
  if(purchasedCoursesIds.indexOf(COURSES[i].id) !== -1){
    purchasedCourses.push(COURSES[i]);
  }
  }
  res.json({ purchasedCourses });
});





//parsedResponse = (data) => {
// console.log(data);
//}




app.listen(3000, () => {
  console.log('Server is listening on port 3000');
});
