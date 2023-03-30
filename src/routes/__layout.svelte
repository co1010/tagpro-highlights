<script>
    import "../app.css";
    import { onMount } from "svelte";
    import firebaseConfig from "../util/firebase-config";
    import { initializeApp } from "firebase/app";
    import { getFirestore, doc, setDoc, getDoc } from "firebase/firestore";


    onMount(async () => {
        if (localStorage.getItem('tphuserid') == null) {
            const db = getFirestore(initializeApp(firebaseConfig));
            localStorage.setItem('tphuserid', Date.now());
            localStorage.setItem('seen', JSON.stringify([]));
            // Add new user in users collection
            await setDoc(doc(db, "users", localStorage.getItem('tphuserid')), {
                votes: 0
            });
        }
    })
</script>

<slot />