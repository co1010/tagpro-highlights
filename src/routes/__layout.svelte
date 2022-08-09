<script>
    import "../app.css";
    import { onMount } from "svelte";
    import firebaseConfig from "../util/firebase-config";
    import { initializeApp } from "firebase/app";
    import { getFirestore, doc, setDoc, getDoc } from "firebase/firestore";


    onMount(async () => {
        if (localStorage.getItem('userid') == null) {
            const db = getFirestore(initializeApp(firebaseConfig));
            localStorage.setItem('userid', Date.now());
            localStorage.setItem('seen', JSON.stringify([]));
            // Add new user in users collection
            await setDoc(doc(db, "users", localStorage.getItem('userid')), {
                seen: [],
                votes: 0
            });
        }
    })
</script>

<slot />