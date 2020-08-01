const fs = require('fs');

obj = {}

// Method to delete profile pic during adding user if anything goes wrong
// Method to delete 
obj.deleteImage = (halflink) => {
  
    fulllink = 'C:\\Users\\Dell\\Desktop\\infiniti\\' + halflink;
    console.log('full link---', fulllink)
    fs.unlink(fulllink, (err) => {
        if (err) {
          console.error(err)
          return
        }else{
            console.log('----------Image deleted---------------')
        }
      })
}

module.exports = obj;