// var SpeechRecognition = SpeechRecognition || webkitSpeechRecognition
// var SpeechGrammarList = SpeechGrammarList || webkitSpeechGrammarList
// var SpeechRecognitionEvent = SpeechRecognitionEvent || webkitSpeechRecognitionEvent

// var triggers = ['take notes', 'stop'];
// var grammar = '#JSGF V1.0; grammar colors; public <triggers> = ' + triggers.join(' | ') + ' ;'

// var recognition = new SpeechRecognition();
// var speechRecognitionList = new SpeechGrammarList();
// speechRecognitionList.addFromString(grammar, 1);
// recognition.grammars = speechRecognitionList;
// //recognition.continuous = false;
// recognition.lang = 'en-US';
// recognition.interimResults = false;
// recognition.maxAlternatives = 1;

// document.body.onclick = function() {
//   recognition.start();
//   console.log('Ready to receive a color command.');
// }

// recognition.onresult = function(event) {
//   // The SpeechRecognitionEvent results property returns a SpeechRecognitionResultList object
//   // The SpeechRecognitionResultList object contains SpeechRecognitionResult objects.
//   // It has a getter so it can be accessed like an array
//   // The [last] returns the SpeechRecognitionResult at the last position.
//   // Each SpeechRecognitionResult object contains SpeechRecognitionAlternative objects that contain individual results.
//   // These also have getters so they can be accessed like arrays.
//   // The [0] returns the SpeechRecognitionAlternative at position 0.
//   // We then return the transcript property of the SpeechRecognitionAlternative object

//   var last = event.results.length - 1;
//   var color = event.results[last][0].transcript;

//   diagnostic.textContent = 'Result received: ' + color + '.';
//   bg.style.backgroundColor = color;
//   // console.log('Confidence: ' + event.results[0][0].confidence);
//   console.log(event);
// }

// recognition.onspeechend = function() {
//   recognition.stop();
// }


//////////////////////////////////////////////////////////////////////////////////// 
/*
TO DO LIST

Edit tasks

Trigger word to start writing task
If you click button when already recording it doesnt break

Login

Front End
   separate tasks



*/

//////////////////////////////////////////////////////////////////////////////////// 

var colors = [ 'aqua' , 'azure' , 'beige', 'bisque', 'black', 'blue', 'brown', 'chocolate', 'coral', 'crimson', 'cyan', 'fuchsia', 'ghostwhite', 'gold', 'goldenrod', 'gray', 'green', 'indigo', 'ivory', 'khaki', 'lavender', 'lime', 'linen', 'magenta', 'maroon', 'moccasin', 'navy', 'olive', 'orange', 'orchid', 'peru', 'pink', 'plum', 'purple', 'red', 'salmon', 'sienna', 'silver', 'snow', 'tan', 'teal', 'thistle', 'tomato', 'turquoise', 'violet', 'white', 'yellow'];
var grammar = '#JSGF V1.0; grammar colors; public <color> = ' + colors.join(' | ') + ' ;'

if (!('webkitSpeechRecognition' in window)) {
    //Speech API not supported here…
    alert("Broken");
} else { //Let’s do some cool stuff :)
    var recognition = new webkitSpeechRecognition(); //That is the object that will manage our whole recognition process. 
    recognition.continuous = true;   //Suitable for dictation. 
    recognition.interimResults = true;  //If we want to start receiving results even if they are not final.
    //Define some more additional parameters for the recognition:
    recognition.lang = "en-US"; 
    recognition.maxAlternatives = 1; //Since from our experience, the highest result is really the best...
//     var speechRecognitionList = new SpeechGrammarList();
// speechRecognitionList.addFromString(grammar, 1);
// recognition.grammars = speechRecognitionList;
}

recognition.onstart = function() {
    //Listening (capturing voice from audio input) started.
    //This is a good place to give the user visual feedback about that (i.e. flash a red light, etc.)
    console.log("it lives");
};

recognition.onresult = function(event) { //the event holds the results
//Yay – we have results! Let’s check if they are defined and if final or not:
    if (typeof(event.results) === 'undefined') { //Something is wrong…
        recognition.stop();
        return;
    }

    for (var i = event.resultIndex; i < event.results.length; ++i) {      
        if (event.results[i].isFinal) { //Final results
            document.getElementById('output').style.backgroundColor = "purple";
            var newNote = event.results[i][0].transcript;
            var newNoteObj = {
                title: 'testNote',
                main: newNote,
                created_at: moment().format("h:mma on MM-DD-YYYY")
             };
            $.post('/notes', newNoteObj).done(function(data) {
                var noteTag = $("<div>");
                noteTag.addClass("noteOnPage");
                var deleteButton = $("<button/>", {
                    text: "Remove Note",
                    click: function() {
                        if(confirm("Are you sure you want to delete this task?")) {
                            $(this).parent().remove();
                            $.ajax({
                                url: '/notes/' + data._id,
                                type: 'DELETE',
                                success: function(result) {
                                    // Do something with the result
                                    console.log(result);
                                }
                            });    
                        }
                    }
                });
                var editButton = $("<button/>", {
                    text: "Edit Note",
                    click: function() {
                        if(confirm("Are you sure you want to update this task?")) {
                            $.ajax({
                                url: '/notes/' + data._id,
                                type: 'PUT',
                                success: function(result) {
                                    // Do something with the result
                                    console.log(result);
                                }
                            });    
                        }
                    }
                });
                editButton.addClass('editButtons');

                noteTag.append("<p>" + newNote + " | Created At: " + newNoteObj.created_at + "</p>");
                noteTag.append(deleteButton);
                noteTag.append(editButton);
                // noteTag.append("<p>At " + newNoteObj.created_at + "</p>");

                $("#output").prepend(noteTag);

            recognition.stop();
            start_img.src = 'https://speechlogger.appspot.com/images/micoff2.png';

            });
        }



             //.then( (response) => {
            //     console.log(response);
            // }).catch( (error) => {
            //     console.log(error);
            // });

            

               //Of course – here is the place to do useful things with the results.
        else {   //i.e. interim...
            console.log("interim results: " + event.results[i][0].transcript);  //You can use these results to give the user near real time experience.
            // document.getElementById("output").innerHTML = "typing...."
            document.getElementById('output').style.backgroundColor = "blue";
        } 
    } //end for loop
} 


// document.onclick = function() {
//   recognition.start();
//   console.log('Ready to receive a color command.');
// }

function startButton(event) {
    recognition.start();
    start_img.src = 'https://speechlogger.appspot.com/images/micslash2.png'; //We change the image to a slashed until the user approves the browser to listen and recognition actually starts. Then – we’ll change the image to ‘mic on’.
}


