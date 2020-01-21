# A suite of components for acclerated UI creation
There are multiple components for navigation & sub menus, a simple page footer and lots of functional components

#   NavigationMenu
This is a top of page nav bar 80px high which allows the specification of an icon (top left), a title and sub title, a user avatar + name and role text and a configurable set of menu items.

![alt text](https://files-manywho-com.s3.amazonaws.com/bf9c8481-0fbe-4240-941d-8d928744ba4d/NavigationMenu.png)

The user element shows an icon for the user and their name, the user name is gotten from flow and that, if specified, maps to a png file in assets with the same file name e.g. username=fred.bloggs graphic should be fred.bloggs.png

The menu items are configured using a list in flow and can be displayed as icons with tool tips or text.  They support child items as a drop down.  

Each one can be a NAVIGATE, FUNCTION, OPEN, OUTCOME or MENU


* NAVIGATE will redirect the current browser to another Uri page named in value.
* OPEN will open the Uri in a new tab named in value
* OUTCOME will trigger the specified outcome named in value
* FUNCTION will execute the JS function named in value, you can use "exit", "close" or "quit" to do a window.close.
* MENU allows specifying the name of a list (int the value field) which contains other MenuItems to form a child dropdown menu.


So create the MenuItem type and then a list of them and set the values - the type definition is shown below to be created via the API.

Drop a component on your page, change its componentType to NavigationMenu, set its DataSource to your MenuItem list.

Set these attributes: - and add these attributes: -

* logo                    string      the full url to the graphic you want for the top left icon, can be multiple with comma or semicolon delimiter.  
                                    you could store the logo graphic in assets for ease.
* title                   string      the title bar title label
* sub-title               string      some smaller text to show under the title label
* hide-user-anonymous     boolean     true to completely hide the user details if in anonymous mode i.e. flow doesn't use authentication, false
* hide-user               boolean     true to completely hide the user details.
* hide-user-text          boolean     true will supress showing the user's name/info text


If flow is using authenication then you should add a .jpg file for each user named with their email e.g. fred_bloggs@somewhere.com.jpg.  This image will be used for the user's avatar.  You should also add a default user avatar for admin@manywho.com.jpg to represent the anonymous user.

#   MenuBar
Adds a colored sub menu.

This takes a list of menu items in it's datasource like the NavigationMenu.

There is an extra type defined called LABEL which will just show the text specified.

#   Footer
The Footer component shows a simple bar at the bottom of the page in which you can set a single string of text to be shown centered in the page.

![alt text](https://files-manywho-com.s3.amazonaws.com/bf9c8481-0fbe-4240-941d-8d928744ba4d/Footer.png)

Drop a component on your page, change its componentType to Footer, set its DataSource to your MenuItem list. 

Set these attributes: -
* title   string  The text to be displayed in the footer. Can be surrounded with double braces {{xx.yy.zz}} to do value lookup.



# Menu Item

The exact function of each menu item is defined in the pre-requisite MenuItem type: -

* label       string  the display text for the item, the caption
* value       string  the value used when this menu item is triggered e.g. the name of the outcome to trigger 
                    or the Uri to open in a new tab etc.  Can be surrounded with double braces {{xx.yy.zz}} to do value lookup.
* icon        string  the bootstrap glyphicon to display, just the short name without the "glyphicon-" part e.g. envelope or wrench.  
                    if not specifed then it shows the label, this controls if it's an icon or text menu item
* type        string  the action type NAVIGATE, OPEN, OUTCOME, MENU, FUNCTION
* name        string  the internal name of the menu, not really used
* * order       number  the display order or position from 1-99 allowing you to define the order the menu items are shown
subItems    list    a list of child MenuItem objects to use for nested dropdown.


in the tenant's API tool open the type endpoint /api/draw/1/element/type and paste thie following JSON then POST it.


```
{
        "developerName": "MenuItem",
        "developerSummary": "A Menu Item",
        "elementType": "TYPE",
        "properties": [
            {
                "contentFormat": "",
                "contentType": "ContentString",
                "developerName": "label",
                "typeElementDeveloperName": null,
                "typeElementId": null
            },
            {
                "contentFormat": "",
                "contentType": "ContentString",
                "developerName": "value",
                "typeElementDeveloperName": null,
                "typeElementId": null
            },
            {
                "contentFormat": "",
                "contentType": "ContentString",
                "developerName": "icon",
                "typeElementDeveloperName": null,
                "typeElementId": null
            },
            {
                "contentFormat": "",
                "contentType": "ContentString",
                "developerName": "type",
                "typeElementDeveloperName": null,
                "typeElementId": null
            },
            {
                "contentFormat": "",
                "contentType": "ContentString",
                "developerName": "name",
                "typeElementDeveloperName": null,
                "typeElementId": null
            },
            {
                "contentFormat": "",
                "contentType": "ContentNumber",
                "developerName": "order",
                "typeElementDeveloperName": null,
                "typeElementId": null
            }
        ]
    }
```

# QRCodeReader

Uses the camera of the device to scan for QR Codes & Barcodes from live video.

Uses the zxing library for image interpretation.

Set the state to a string value to receive the barcode value.

Set the width & height to control the display size on the page.

Set these attributes: -
* OnDetect =  to the name of an outcome to auto trigger the outcome on detection of a code, optional.
* OnCancel = to the name of an outcome.  This will add a cancel button which will trigger the outcome, optional.

# QRCodeWriter

Generates a QR code on screen from the string state value.

Uses the zxing library.

Set the state to a string value which provides the barcode value.

Set the width & height to control the display size on the page.


# FileData
This structure is used by several components as the structure to pass files to and from Flow

```
{
    "bindings": null,
    "developerName": "FileData",
    "developerSummary": "",
    "elementType": "TYPE",
    "id": null,
    "properties": [
        {
            "contentFormat": "",
            "contentType": "ContentString",
            "developerName": "Content",
            "id": null,
            "typeElementDeveloperName": null,
            "typeElementId": null
        },
        {
            "contentFormat": "",
            "contentType": "ContentString",
            "developerName": "FileName",
            "id": null,
            "typeElementDeveloperName": null,
            "typeElementId": null
        },
        {
            "contentFormat": "",
            "contentType": "ContentString",
            "developerName": "Extension",
            "id": null,
            "typeElementDeveloperName": null,
            "typeElementId": null
        },
        {
            "contentFormat": "",
            "contentType": "ContentNumber",
            "developerName": "Size",
            "id": null,
            "typeElementDeveloperName": null,
            "typeElementId": null
        },
        {
            "contentFormat": "",
            "contentType": "ContentString",
            "developerName": "MimeType",
            "id": null,
            "typeElementDeveloperName": null,
            "typeElementId": null
        }
    ]
}
```

#   Selfie

Uses the camera of the device to capture a photo.

Set the state to either a string value to receive the base64 dataUri or to a FileData object  (defined above) to receive a complex object.

Set the width & height to control the display size on the page.

Set an attribute called "takePhotoOutcome" to the name of an outcome to auto trigger when the photo is taken.


#   FileDownloader

Puts an icon on the page which when clicked will push a file to the browser.

![alt text](https://files-manywho-com.s3.amazonaws.com/bf9c8481-0fbe-4240-941d-8d928744ba4d/FileDownloader.png)

Use a FileData value as the state.

These attributes control the appearance: -

* title - then title text displayed under the icon - default = "File Downloader"
* icon  - the bootstrap glyphicon to use, the short name without "glyphicon-" e.g. trash, envelope - default=envelope
* pointSize - the point size for the icon - default=24 
* onClickOutcome - the name of an outcome to trigger when the file is downloaded

#   FilePicker

Puts an box on the screen where the user can click to select a local file to store into a FileData value in flow.

![alt text](https://files-manywho-com.s3.amazonaws.com/bf9c8481-0fbe-4240-941d-8d928744ba4d/FilePicker.png)


Image type files will be resized to 400px on longest side.

Use a FileData value as the state.

Set the width & height to control the display size on the page.

These attributes control the appearance: -

* title - then title text displayed in the title bar - default = "Select File"

#   GraphicOutcomeTile

Displays a big graphical button.

![alt text](https://files-manywho-com.s3.amazonaws.com/bf9c8481-0fbe-4240-941d-8d928744ba4d/GrahicOutcomeTile.png)


Set these attributes: -
* title - the title at top of button
* text - the summary text below the title
* image - the url of an image to show on the tile
* tooltip - mouse hover text


#   PopupInfo

Displays an icon button which when clicked pops up a modal dialog showing a Content value from Flow..

Set the state to a Flow content field containing the message to show in popup box

Set these attributes: -
* title - the title at top of popup
* closeButtonLabel - the text on the modal close button
* icon - the short name of a glyphicon to display on the page
* iconPointSize - the point size of the icon
* iconColour - the colour string for the icon e.g. "red", "#333333" or rgb(255,255,255)
* tooltip - mouse hover text

# IconProgressBar

Displays a row of icons showing progress through stages

![alt text](https://files-manywho-com.s3.amazonaws.com/bf9c8481-0fbe-4240-941d-8d928744ba4d/iconprogressbar.png)

You configure the icons and how they relate to a numeric progress field.

The value of the state field is compared to the key values in the icon array.  
Those of a lower value are complete, equal is active and higher are incomplete

Set the model to a list of 'IconProgressItem' containing the various icons
Set the state value to a field containing an number showing current progress

Set these attributes: -
* iconPointSize - the title at top of popup
* incompleteColour - the colour string for the icon when incomplete e.g. "red", "#333333" or rgb(255,255,255)
* activeColour - the colour string for the icon when active e.g. "red", "#333333" or rgb(255,255,255)
* completeColour - the colour string for the icon when complete e.g. "red", "#333333" or rgb(255,255,255)


# IconProgressItem

This type is used for holding the icons for the IconProgressBar


* key - number, the value to evaluate against the current progress in the state
* tooltip - string, the text to show when howering
* icon - string, the short name of a glyph icon to display.

use this JSON

```
{
        "bindings": null,
        "developerName": "IconProgressItem",
        "developerSummary": "",
        "elementType": "TYPE",
        "id": null,
        "properties": [
            {
                "contentFormat": "",
                "contentType": "ContentNumber",
                "developerName": "key",
                "id": null,
                "typeElementDeveloperName": null,
                "typeElementId": null
            },
            {
                "contentFormat": "",
                "contentType": "ContentString",
                "developerName": "tooltip",
                "id": null,
                "typeElementDeveloperName": null,
                "typeElementId": null
            },
            {
                "contentFormat": "",
                "contentType": "ContentString",
                "developerName": "icon",
                "id": null,
                "typeElementDeveloperName": null,
                "typeElementId": null
            }
        ],
        "serviceElementDeveloperName": null,
        "serviceElementId": null,
    }
```