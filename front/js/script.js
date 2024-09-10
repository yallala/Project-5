console.log("hi");
// Milestone 1, 2 and 3 are the golas by end of this week
// MENTOR DEMO, API REQUIREMENT DOCUMENTS ARE PREREQUISITES FOR MILESTONE 2


// TODO declare function to insert products into the page


fetch('http://localhost:3000/api/products')
    .then(data => {
        return data.json();
    })
    .then(products => {
        //TODO Call function to insert products
        console.log(products)
    });

    //TODO Do the course work until section -3 https://openclassrooms.com/en/courses/5493201-write-javascript-for-the-web/5496636-modify-the-dom
    // TODO Watch Scott demo
    // TODO Look for Today and last time notes
    
    // FIXME NO CSS NO HTML

// TODO https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Template_literals

//TODO COMMIT CODE TO GITHUB- Commit to GITHUB NOW
