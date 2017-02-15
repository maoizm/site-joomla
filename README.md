#Joomla 3.x site development -- starlink.ua

*(does not containt core Joomla files)*

## Installation

[Detailed instructions in INSTALL.md](https://github.com/maoizm/site-joomla/blob/develop/INSTALL.md "Installation instructions")

## Configuration

[See INSTALL.md](https://github.com/maoizm/site-joomla/blob/develop/INSTALL.md "Configuration instructions")


## Usage

1. Edit source files in `.src/**`
2. Compile `.src/**` and copy to Joomla folders: `gulp compile`
3. Compile only `mod_starlink`:  `gulp modstarlink:compile`
    1. Compile only `mod_starlink`'s css:  `gulp modstarlink:compile:css`
4. Compile & put in `.zip` package ready for offline installation in Joomla: `gulp modstarlink:build`  
   *(.zip files will be copied to* `.dist/` *)*
5. Delete and rebuild all production files from .src:
   ````bash
   gulp clean
   gulp build
   ````
   
   
### Database operations

#### Backup Joomla db to file 

Database will be copied to file `.YYYYMMDD_HHMM.sql.gz`

 - ##### Linux
   `.src/0_database/db2file.sh`
 
 - ##### Windows 
   `.src\0_database\db2file.cmd`

#### Restore Joomla db from file 

 - ##### Linux
   `.src/0_database/file2db.sh .20161201_1901.sql.gz`

## Other

####svg icons

##### include icon library in the php template:
 
```php
require_once '../media/mod_starlink/images/icons.svg';
```
  
##### insert particular icon in HTML: 

```html
<svg class="icon"><use xlink:href="#iconCancel" /></svg>
```
  
##### currently available icons:

- common icons:
  - `#iconCancel`
  - `#iconCheck`
  - `#iconChevronLeft`
  - `#iconChevronRight`
  - `#iconExpandLess`
  - `#iconExpandMore`
  - `#iconPhone`

- social networks' logos:
  - `#iconFacebook`
  - `#iconGooglePlus`
  - `#iconTwitter`


#### style/theme icon in CSS 
      
```css
/* base/default style */
.icon { 
  height: 2em; 
  width: 2em; 
}

/* add custom themes */
svg.icon--main {
  fill: blue;
}
svg.icon--alert {
  fill: red;
}
```

```html
<svg class="icon icon--main"><use xlink:href="#iconCheck" /></svg>
<svg class="icon icon--alert"><use xlink:href="#iconCheck" /></svg>