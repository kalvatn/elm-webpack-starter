function save(markdownFile) {

  markdownFile.saveChanges(function(err, success) {
    if (err) {
      console.log(err);
    } else {
      console.log('saved file');
    }
  });

}
