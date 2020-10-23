class Course{
  constructor(id,title,introduction,image){
    this.id = Math.floor(Math.random() *1000);
    this.title = title;
    this.introduction = introduction;
    this.image = image;
  }
}

class UI{
  addCourseList(course){
    const list = document.getElementById("course-list")
    var html = `
    <table class="table table-striped">
      <tbody>
        <tr>
          <td>${course.id}</td>
          <td>${course.image}</td>
          <td>${course.title}</td>
          <td>${course.introduction}</td>
          <td><a href="#" id="courseDelete" data-id="${course.id}" class="btn btn-danger btn-sm delete">Delete</a></td>
        </tr>
      </tbody>
    </table>
    `;
    list.innerHTML += html;
  }
  
  clearCourseList(){
    const title = document.getElementById("title").value = "";
    const introduction = document.getElementById("introduction").value = "";
    const image = document.getElementById("image").value = "";    
  }
  
  deleteCourse(btn){    
    if(btn.classList.contains("delete") == true){
      btn.parentElement.parentElement.remove();
    }
  }
  
  notification(message,status){
    const ntfc = document.querySelector('form');
    alert = ntfc.insertAdjacentHTML('beforebegin',`
    <div class="alert alert-${status}" role="alert">
      ${message}
    </div>
    `)

    setTimeout(() => {
      document.querySelector('.alert').remove();
    },1500)

  }
}

class Storage{
  
  static getCourses(){
    let courses;
    if(localStorage.getItem('courses') === null){
      courses = [];
    } else {
      courses = JSON.parse(localStorage.getItem('courses'));
    }
    return courses;
  }
  
  static displayCourses(){
    /* Display de ui ile ilgili bir işlem yapmam gerekiyor 
    * getCourses tan gelen veriyi burada kullanarak ui objesi oluşturduk
    * Form Load edildiğinde ise Storage constructor dan displayCourse fonksiyonunu çalıştırdık
    * Dolayısıyla form yüklendiği anda LS teki verilerimiz listeye gelmiş oldu
    */
    const courses = Storage.getCourses();
    courses.forEach(course => {
      const ui = new UI();
      ui.addCourseList(course)
    });
  }

  static addCourse(course){
    let courses = Storage.getCourses();
    courses.push(course)
    localStorage.setItem('courses', JSON.stringify(courses));
  }

  static deleteCourse(element){
    const btn = element.classList.contains("delete");
    if(btn == true){
      const id = element.getAttribute("data-id");
      const courses = Storage.getCourses();

      courses.forEach((course,index) => {
        if(course.id == id){
          courses.splice(index,1);
        }
      })
      localStorage.setItem('courses', JSON.stringify(courses))
    }
  
  }

}

document.addEventListener('DOMContentLoaded',Storage.displayCourses)

document.getElementById("course-register").addEventListener('submit', (e) => {  
  const id = Course.id;
  const title = document.getElementById("title").value;
  const introduction = document.getElementById("introduction").value;
  const image = document.getElementById("image").value;
  const course = new Course(id,title,introduction,image); // * Course instance Created
  const ui = new UI();

  // add course of the UI  
  if(!(title == "" || introduction == "" || image == "")){
    // add course to list
    ui.addCourseList(course)
    // save to LS
    Storage.addCourse(course);

    ui.notification('course successfully added','success');
  } else{
    ui.notification('Please complete the form','warning');
  }
  // clear TextBox
  ui.clearCourseList();

  e.preventDefault();
})

document.getElementById("course-list").addEventListener('click', (e) => {
  const ui = new UI();
  // delete course
  ui.deleteCourse(e.target)
  // delete course from LS
  Storage.deleteCourse(e.target);
  
  ui.notification("Registration couldn't be done","danger")

  e.preventDefault();
})