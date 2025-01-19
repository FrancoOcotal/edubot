// Back4App Initialization
const BACK4APP_APPLICATION_ID = "1cXUxmno8cpVkVD3eTU3eDVfZONVN4rREbmCKBTf"; // Reemplaza con tu Application ID
const BACK4APP_JAVASCRIPT_KEY = "FS0iAkdFNarshpcdwvotxH0G2KWyIrjv9pDwFq51"; // Reemplaza con tu JavaScript Key

Parse.initialize(BACK4APP_APPLICATION_ID, BACK4APP_JAVASCRIPT_KEY);
Parse.serverURL = "https://parseapi.back4app.com/";

// Test connection to Back4App
async function testConnection() {
    try {
        const TestObject = Parse.Object.extend("TestObject");
        const testInstance = new TestObject();
        testInstance.set("name", "Test Connection");
        await testInstance.save();
        console.log("Connection successful: Object saved!");
    } catch (error) {
        console.error("Connection failed: ", error);
    }
}

// Call the test function
testConnection();
