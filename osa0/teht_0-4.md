sequenceDiagram
    participant browser
    participant server
	
	Note right of browser: The submit button is pressed on the webpage and the browser sends in the filled in data to the server
	
	browser->>server: POST https://studies.cs.helsinki.fi/exampleapp/new_note
    activate server
	
	Note left of server: The server reads the feed from "Form Data > note:'the content of the message field'"<br>and includes it in /exampleapp/data.json
	
    server-->>browser: redirect to /exampleapp/notes
    deactivate server
    
    browser->>server: GET https://studies.cs.helsinki.fi/exampleapp/notes
    activate server
    server-->>browser: HTML document
    deactivate server
    
    browser->>server: GET https://studies.cs.helsinki.fi/exampleapp/main.css
    activate server
    server-->>browser: the css file
    deactivate server
    
    browser->>server: GET https://studies.cs.helsinki.fi/exampleapp/main.js
    activate server
    server-->>browser: the JavaScript file
    deactivate server
    
    Note right of browser: The browser starts executing the JavaScript code that fetches the JSON from the server
    
    browser->>server: GET https://studies.cs.helsinki.fi/exampleapp/data.json
    activate server
    server-->>browser: [{ "content": ":)", "date": "2023-06-12" }, ... ]
    deactivate server    

    Note right of browser: The browser executes the callback function that renders the notes including the new note saved at the start of the diagram