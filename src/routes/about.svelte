<script>
    import Github from "../assets/GithubSVG.svelte";
    import Back from "../assets/BackSVG.svelte";
</script>


<div class="w-screen h-screen flex justify-center items-center grow-0 basis-1/2">
    <div class="bg-white w-1/2">
            <button class="ml-4 mt-4"><a href="/"><Back/> Back</a></button>
            <div class="mx-16 mb-16 mt-8">
                <h1 class="text-4xl underline pb-2">Purpose</h1>
                <p>
                    The purpose of this site is to rank every TagPro clip ever created.
                    Users are shown two clips on the vote page and will vote for the better
                    clip after watching both of them. After a user votes at least 5 times, they
                    can see the leaderboard, which is a ranking of all clips based on the sum of
                    votes they received in the voting process.
                </p>
                <h1 class="text-4xl underline pb-2 pt-8">About The Site</h1>
                <p>
                    This website was made by Colin / <a href="https://github.com/co1010" target="_blank">
                    <Github/> co1010</a> / CoolCat. I originally had
                    this website idea in August 2022. Since I was changing jobs I had some free time
                    and figured I could use it to a) make something cool and b) learn a new web
                    dev framework. Speaking of which, this website was built with Svelte and uses
                    Firestore as its database :)
                </p>
            </div>
    </div>
</div>