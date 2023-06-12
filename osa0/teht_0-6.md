sequenceDiagram
    participant browser
    participant server
	
	Note right of browser: The submit button is pressed on the webpage and the browser executes a task handler<br>that adds the contents of the form into the notes and renders them again<br>and sends them to them to the server in "content: application/json" format.
	    
	browser->>server: POST https://studies.cs.helsinki.fi/exampleapp/new_note_spa
    activate server
	
	Note left of server: The server reads the feed from "Form Data > note:'the content of the message field'"<br>and includes it in /exampleapp/data.json
	
    server-->>browser: status 201 created, "message":"note created" 
    deactivate server