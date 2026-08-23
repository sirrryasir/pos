import { auth } from "./lib/auth";
async function main() {
    try {
        const res = await auth.api.signUpEmail({
            body: {
                email: "test4@test.com",
                password: "password123",
                name: "Test 4"
            }
        });
        console.log("Success:", res.user.email);
    } catch (error) {
        console.error(error);
    }
}
main();
