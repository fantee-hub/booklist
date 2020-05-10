class Book{
  constructor(title,author,isbn){
    this.title=title;
    this.author=author;
    this.isbn=isbn;
  }
}

class UI{
  addBookList(book){

    const list=document.getElementById('book-list');
  // create new row element
  const row=document.createElement('tr');
  row.innerHTML=`
  <td>${book.title}</td>
  <td>${book.author}</td>
  <td>${book.isbn}</td>
  <td><a href="#" class="delete">X</a></td>
  `
  // add the new row to the list
  list.appendChild(row)
  //console.log(row)
  }

  clearInputValue(){
    // clear text fields
  document.getElementById('title').value='';
  document.getElementById('author').value='';
  document.getElementById('isbn').value='';
  }

  showAlert(msg,className){
     // create a new div element
  const divCont=document.createElement('div');
  divCont.className=`alert ${className}`;
  divCont.appendChild(document.createTextNode(msg));

  //place the div container before the form page
  const container=document.querySelector('.container');
  const form=document.querySelector('#book-form');

  container.insertBefore(divCont,form);
  //console.log(divCont)

  // set timeout
  setTimeout(function(){
    document.querySelector('.alert').remove()
  },3000);
  }
  removeBooks(target){
    if(target.className==='delete'){
      target.parentElement.parentElement.remove();
    }
  }
}

class Store{
  static getBooks(){
  let books;
  if(localStorage.getItem('books')===null){
    books=[];
  }else{
    books=JSON.parse(localStorage.getItem('books'));
  }
  return books;
  }
  static storeBooks(book){
    const books=Store.getBooks();
    books.push(book);
    localStorage.setItem('books', JSON.stringify(books));
  }
  static displayBooks(){
    const books=Store.getBooks();

    
   books.forEach(function(book){
    const ui=new UI();
    ui.addBookList(book);
    localStorage.setItem('books',JSON.stringify(books));
   })


  }
  static removeBooks(isbn){

    const books=Store.getBooks();
    books.forEach(function(book,index){
      if(book.isbn===isbn){
        books.splice(index,1)
      }
     
    })
    localStorage.setItem('books',JSON.stringify(books));
  }
}
document.addEventListener('DOMContentLoaded',Store.displayBooks)

// Add event listener to submit button
const formWrapper=document.getElementById('book-form').addEventListener('submit',function(e){

  //get value of title,author and isbn
  const titleVal=document.getElementById('title').value,
        authorVal=document.getElementById('author').value,
        isbnVal=document.getElementById('isbn').value;
  
  // instatitate Book constructor
  const book=new Book(titleVal,authorVal,isbnVal);

  // instantiate UI constructor
  const ui=new UI();

  //validate input field
  if(titleVal==='' || authorVal==='' || isbnVal===''){
    ui.showAlert('Please fill in the fields','error');
  }
  else{
    // add book list
  ui.showAlert('Books successfully submitted','success')
  ui.addBookList(book);
  // add to local storage
  Store.storeBooks(book);
  //display

  //console.log(ui)
  ui.clearInputValue();
  
  }
  e.preventDefault();
})

// remove book event listener
document.querySelector('#book-list').addEventListener('click',function(e){
  
  const ui=new UI();
  ui.removeBooks(e.target);
  Store.removeBooks(e.target.parentElement.previousElementSibling.textContent);
  ui.showAlert('Book successfully removed!','success');
  e.preventDefault();
})