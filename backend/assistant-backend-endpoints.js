// Implementation of customer support chatbot without RAG for ABC Shoe company
require('dotenv').config();
const OpenAI = require('openai/index.mjs');
const readlineSync = require('readline-sync');
const fs = require('fs');
const express = require('express');
const cors = require('cors');

const openai = new OpenAI();
const app = express();
const port = 4000;

app.use(express.json());
app.use(cors());
app.use(express.urlencoded({extended: true}));

const LANGUAGE_MODEL = "gpt-3.5-turbo-1106";
const LANGUAGE_MODEL_GPT4_PREVIEW = "gpt-4-turbo-preview";
const ASSISTANT_NAME = "Customer Support Assistant";
const ASSISTANT_DEFAULT_INSTRUCTIONS =
  "You are a personal assistant for ABC Shoe company. Give professional answers for the customers.";

async function moderateConversation(req, res) {
    const moderation = await openai.moderations.create({ input: req.body.input });

    console.log("categories: ", moderation.results[0].categories);
    console.log("category_scores: ", moderation.results[0].category_scores);
    res.status(200).send(moderation.results[0].flagged);
}

// Upload File to OpenAI
const uploadFile = async(filepath) => {
    try{
        const file = await openai.files.create({
            file: fs.createReadStream(filepath),
            purpose: "assistants",
        });
        // console.log("file: ",file);
        // console.log("file_id: ",file.id);
        return file.id;
    }catch(error){
        console.error("Error uploading file: ", error);
    }
    
}

// Step 1: Create an Assistant
const createAssistant = async (file_id) => {
    const myAssistant = await openai.beta.assistants.create({
        instructions: ASSISTANT_DEFAULT_INSTRUCTIONS,
        name: ASSISTANT_NAME,
        tools: [
            { type: "code_interpreter" }  // Using code_interpreter which accepts file_ids
        ],
        model: LANGUAGE_MODEL,
        tool_resources: {
            code_interpreter: {
                file_ids: [file_id]  // Correctly associates file_ids for code_interpreter
            }
        }
    })
    return myAssistant;
};

// Step 2: Create a Thread
const createThread = async() => {
    return await openai.beta.threads.create();
}


// Step 3: Add a Message to a Thread
const addMessageToThread = async(thread_id, user_input) => {
    try{
        const threadMessages = await openai.beta.threads.messages.create(
            thread_id,
            { role: "user", content: user_input }
        );
        return threadMessages;
    }catch(error){
        console.log(error);
    }
}

// Step 4: Run the Assistant
const runAssistantOnThread = async(thread_id, assistant_id) => {
    try{
        const run = await openai.beta.threads.runs.create(
            thread_id,
            { 
                assistant_id: assistant_id,
                instructions: "Please address the user as Rok Benko."
            }
          );
        
        console.log("This is run object: ", run, "\n");
        return run;
    }catch(error){
        console.log(error);
    }
}

// Step 5: Check the Run Status
const checkRunStatus = async(thread, run) => {
    // console.log(run);
    return await openai.beta.threads.runs.retrieve(
        thread.id,
        run.id
    );
}

// Step 6: Retrieve and display the Messages
const retrieveMessages = async(run, thread) => {
    if (run.status === "completed") {
        console.log("This is the run status: ", run.status, "\n");
        const messages = await openai.beta.threads.messages.list(thread.id);
    
        // display messages
        console.log("All messages: ", messages); // Log all messages for debugging
    
        if (messages.data[0].content[0].text) {
          return messages.data[0].content[0].text.value;
        }
    }
}

let assistant, thread;
  
async function main(_, res) {
    // Step 0: Create a File
    const file_id = await uploadFile("files/faq_abc.txt");

    // Step 1: Create an Assistant
    assistant = await createAssistant(file_id);

    // Step 2: Create a Thread
    thread = await createThread();
    res.status(200).send(thread);
}

async function sendMessage(req, res){
    const message = await addMessageToThread(thread.id, req.body.input);
    console.log("user: ", message.content[message.content.length - 1].text.value);
  
    // Step 4: Run the Assistant
    let run = await runAssistantOnThread(thread.id, assistant.id);

    // Step 5: Check the Run Status
    while(run.status !== "completed"){
        await checkRunStatus(thread, run);
        // Re-fetch the run status inside the loop
        run = await openai.beta.threads.runs.retrieve(thread.id, run.id);

        if(run.status === "failed" || run.status == "expired"){
            console.log("Chat terminated.");
            // break;
            process.exit();
        }
    }

    // Step 6: Retrieve and display the Messages
    const messages = await retrieveMessages(run, thread);
    console.log(messages);
    res.status(200).send({
        sender: "ai_assistant",
        content: messages,
        flagged: false,
        timestamp: new Date(),
    });
}

app.get("/", main);
app.post("/sendMessage", sendMessage);
app.post("/moderate", moderateConversation);

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
