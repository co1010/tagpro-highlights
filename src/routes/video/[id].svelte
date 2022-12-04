<script>
    import { page } from '$app/stores';
    import { onMount } from 'svelte';
    import firebaseConfig from '../../util/firebase-config';
    import { initializeApp } from "firebase/app";
    import { getFirestore, doc, getDoc } from "firebase/firestore";
    import Clip from '../../components/Clip.svelte';
    import ClipTitle from '../../components/ClipTitle.svelte';

    // Initialize firebase
    const app = initializeApp(firebaseConfig);
    const db = getFirestore(app);

    const id = $page.params.id;
    let title, ratio, url;

    onMount(async () => {
        const docData = await (await getDoc(doc(db, "videos", id))).data();
        title = docData.title;
        ratio = docData.ratio;
        url = docData.url;
    });

</script>

<div class="w-screen h-screen flex justify-center">
    <div class="w-3/5 mt-8">
        <ClipTitle {id} {title} {db}/>
        <br/>
        <Clip src={url} ratio={ratio} size='5/6'/>
    </div>
</div>