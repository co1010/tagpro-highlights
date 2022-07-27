<script>
    import { onMount } from "svelte";
    import firebaseConfig from "../util/firebase-config";
    import { initializeApp } from "firebase/app";
    import { getFirestore, doc, setDoc } from "firebase/firestore";


    onMount(async () => {
        if (localStorage.getItem('userid') == null) {
            localStorage.setItem('userid', Date.now());
            const db = getFirestore(initializeApp(firebaseConfig));
            // Add new user in users collection
            await setDoc(doc(db, "users", localStorage.getItem('userid')), {
                votes: 0
            });
        }
    })
</script>

<div class="w-screen h-screen grid place-content-center">
    <div class="bg-white grid grid-cols-1 p-16 gap-y-16">
        <h1 class="text-4xl">TagPro Clips</h1>
        <button class="bg-yellow-300 px-3 py-1 rounded-full"><a href="/about">About This Site</a></button>
        <button class="bg-yellow-300 px-3 py-1 rounded-full"><a href="/vote">Vote For Clips</a></button>
        <button class="bg-yellow-300 px-3 py-1 rounded-full"><a href="/leaderboard">View The Leaderboard</a></button>
    </div>
</div>