require('dotenv').config();
const OpenAI = require('openai');
const readlineSync = require('readline-sync');
const fs = require('fs');

const openai = new OpenAI();

const LANGUAGE_MODEL = "gpt-3.5-turbo-1106";
const LANGUAGE_MODEL_GPT4_PREVIEW = "gpt-4-turbo-preview";
const ASSISTANT_NAME = "Customer Support Assistant";
const ASSISTANT_DEFAULT_INSTRUCTIONS =
  "You are a professional assistantYou are a professional assistant. You can answer questions related to ABC Shoe Company, such as the types of shoes they offer, their return policy, customer service contacts, shipping information, opening hours, loyalty programs, and more. All of your answers should be based on the FAQ document uploaded to you.";

// Upload File to OpenAI
const uploadFile = async(filepath) => {
    const file = await openai.files.create({
        file: fs.createReadStream(filepath),
        purpose: "assistants",
    });
    // console.log("file: ",file);
    // console.log("file_id: ",file.id);
    return file;
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
    const threadMessages = await openai.beta.threads.messages.create(
        thread_id,
        { role: "user", content: user_input }
    );

    //console.log(threadMessages.content[0].text.value);
}

// Step 4: Run the Assistant
const runAssistantOnThread = async(thread_id, assistant_id) => {
    const run = await openai.beta.threads.runs.create(
        thread_id,
        { assistant_id: assistant_id }
      );
    
    // console.log("this is run object: ", run);
    return run;
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
    if(run.status === "completed"){
        const messages = await openai.beta.threads.messages.list(thread.id);
        console.log("assistant messages: ", messages.data[0].content[0].text.value);
    }
}


function getInput(promptMessage) {
    return readlineSync.question(promptMessage, {
      hideEchoBack: false, // The typed characters won't be displayed if set to true
    });
}
  
async function main() {
    console.log("\n\n----------------------------------");
    console.log("           🤖 AI ASSISTANT           ");
    console.log("---------------------------------- \n ");
    console.log("To exit chat type 'X'");

    // Step 0: Create a File
    const file = await uploadFile("files/faq_abc.txt");

    // Step 1: Create an Assistant
    const assistant = await createAssistant(file.id);

    // Step 2: Create a Thread
    const thread = await createThread();

    while (true) {
        // Step 3: Add a Message to a Thread
        const userMessage = getInput("You: ");
        if (userMessage.toUpperCase() === "X") {
        console.log("Goodbye!");
        process.exit();
        }

        // console.log("userMessage: ", userMessage)
        if (!!userMessage) {
            await addMessageToThread(thread.id, userMessage)
        }

        // Step 4: Run the Assistant
        let run = await runAssistantOnThread(thread.id, assistant.id);

        // Step 5: Check the Run Status
        while(run.status !== "completed"){
            await checkRunStatus(thread, run);
            run = await openai.beta.threads.runs.retrieve(thread.id, run.id);

            if(run.status === "failed" || run.status == "expired"){
                console.log("Chat terminated.");
                // break;
                process.exit();
            }
        }

        // Step 6: Retrieve and display the Messages
        await retrieveMessages(run, thread);
    }
}

main();
