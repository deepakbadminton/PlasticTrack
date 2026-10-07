document.addEventListener("DOMContentLoaded", () => {

    /* ==========================================
       COMMON HELPERS
    ========================================== */

    function getStoredNumber(key) {

        const value = localStorage.getItem(key);

        if (value === null) {
            return null;
        }

        const number = Number(value);

        return Number.isFinite(number)
            ? number
            : null;
    }


    function getChallengeDays() {

        try {

            const stored =
                JSON.parse(
                    localStorage.getItem("challengeDays")
                ) || [];

            return [...new Set(
                stored
                    .map(Number)
                    .filter(day => day >= 1 && day <= 7)
            )].sort((a, b) => a - b);

        } catch {

            return [];

        }
    }


    function saveChallengeDays(days) {

        localStorage.setItem(
            "challengeDays",
            JSON.stringify(days)
        );

    }



    /* ==========================================
       SURVEY
    ========================================== */

    const survey =
        document.getElementById("plasticSurvey");


    if (survey) {

        const params =
            new URLSearchParams(
                window.location.search
            );

        const isAfter =
            params.get("stage") === "after";


        const badge =
            document.getElementById("stageBadge");

        const title =
            document.getElementById("surveyTitle");

        const description =
            document.getElementById(
                "surveyDescription"
            );


        if (isAfter) {

            badge.textContent =
                "AFTER CHALLENGE";

            title.textContent =
                "Measure Your Progress";

            description.textContent =
                "You've completed the challenge. Answer based on your current habits.";

        }


        survey.addEventListener(
            "submit",
            event => {

                event.preventDefault();


                let score = 0;


                for (
                    let i = 1;
                    i <= 5;
                    i++
                ) {

                    const answer =
                        document.querySelector(
                            `input[name="q${i}"]:checked`
                        );


                    if (answer) {

                        score +=
                            Number(answer.value);

                    }

                }


                let category;
                let icon;
                let explanation;
                let suggestion;


                if (score <= 4) {

                    category =
                        "Low Plastic Usage 🌱";

                    icon = "🌱";

                    explanation =
                        "Your responses show relatively low plastic-use behaviour.";

                    suggestion =
                        "Keep your current habits and encourage others to use reusable alternatives.";

                }

                else if (score <= 8) {

                    category =
                        "Moderate Plastic Usage 🌿";

                    icon = "🌿";

                    explanation =
                        "Your responses show some regular plastic-use habits that can be reduced.";

                    suggestion =
                        "Try replacing plastic bags, bottles and disposable items with reusable alternatives.";

                }

                else {

                    category =
                        "High Plastic Usage 🌍";

                    icon = "🌍";

                    explanation =
                        "Your responses show several frequent plastic-use behaviours.";

                    suggestion =
                        "Focus on small daily changes such as carrying a reusable bottle and bag.";

                }


                document.getElementById(
                    "resultIcon"
                ).textContent = icon;


                document.getElementById(
                    "scoreNumber"
                ).textContent = score;


                document.getElementById(
                    "scoreText"
                ).textContent =
                    isAfter
                        ? "Your After-Challenge Score"
                        : "Your Starting Score";


                document.getElementById(
                    "categoryText"
                ).textContent = category;


                document.getElementById(
                    "explanationText"
                ).textContent = explanation;


                document.getElementById(
                    "suggestionText"
                ).textContent = suggestion;


                const nextButton =
                    document.getElementById(
                        "nextButton"
                    );


                if (isAfter) {

                    localStorage.setItem(
                        "afterScore",
                        score
                    );


                    nextButton.href =
                        "dashboard.html";

                    nextButton.textContent =
                        "View My Dashboard →";

                }

                else {

                    localStorage.setItem(
                        "beforeScore",
                        score
                    );

                    localStorage.setItem(
                        "plasticScore",
                        score
                    );


                    nextButton.href =
                        "challenge.html";

                    nextButton.textContent =
                        "Start 7-Day Challenge →";

                }


                const result =
                    document.getElementById(
                        "result"
                    );


                result.classList.remove(
                    "hidden"
                );


                result.scrollIntoView({
                    behavior: "smooth",
                    block: "start"
                });

            }
        );

    }



    /* ==========================================
       CHALLENGE
    ========================================== */

    const challengeGrid =
        document.querySelector(
            ".challenge-grid"
        );


    if (challengeGrid) {

        let completedDays =
            getChallengeDays();


        const progressText =
            document.getElementById(
                "progressText"
            );

        const progressPercent =
            document.getElementById(
                "progressPercent"
            );

        const progressFill =
            document.getElementById(
                "progressFill"
            );

        const completionMessage =
            document.getElementById(
                "completionMessage"
            );


        function updateChallenge() {

            const count =
                completedDays.length;


            const percentage =
                Math.round(
                    (count / 7) * 100
                );


            progressText.textContent =
                `${count} / 7 days completed`;


            progressPercent.textContent =
                `${percentage}%`;


            progressFill.style.width =
                `${percentage}%`;


            document
                .querySelectorAll(
                    ".challenge-card"
                )
                .forEach(card => {

                    const day =
                        Number(
                            card.dataset.day
                        );


                    const button =
                        card.querySelector(
                            "button"
                        );


                    if (
                        completedDays.includes(
                            day
                        )
                    ) {

                        card.classList.add(
                            "completed"
                        );

                        button.textContent =
                            "✓ Completed — Click to Undo";

                    }

                    else {

                        card.classList.remove(
                            "completed"
                        );

                        button.textContent =
                            `Complete Day ${day}`;

                    }

                });


            completionMessage.style.display =
                count === 7
                    ? "block"
                    : "none";

        }


        document
            .querySelectorAll(
                ".challenge-button"
            )
            .forEach(button => {

                button.addEventListener(
                    "click",
                    () => {

                        const day =
                            Number(
                                button.dataset.day
                            );


                        if (
                            completedDays.includes(
                                day
                            )
                        ) {

                            completedDays =
                                completedDays.filter(
                                    item =>
                                        item !== day
                                );

                        }

                        else {

                            completedDays.push(
                                day
                            );

                        }


                        completedDays.sort(
                            (a, b) => a - b
                        );


                        saveChallengeDays(
                            completedDays
                        );


                        updateChallenge();

                    }
                );

            });


        updateChallenge();

    }



    /* ==========================================
       DASHBOARD
    ========================================== */

    const dashboard =
        document.querySelector(
            ".dashboard-container"
        );


    if (dashboard) {

        const before =
            getStoredNumber(
                "beforeScore"
            );


        const after =
            getStoredNumber(
                "afterScore"
            );


        const completedDays =
            getChallengeDays();


        const beforeScore =
            document.getElementById(
                "beforeScore"
            );


        const afterScore =
            document.getElementById(
                "afterScore"
            );


        const improvement =
            document.getElementById(
                "improvement"
            );


        beforeScore.textContent =
            before !== null
                ? `${before}/15`
                : "--";


        afterScore.textContent =
            after !== null
                ? `${after}/15`
                : "--";


        let improvementValue = null;


        if (
            before !== null &&
            after !== null &&
            before > 0
        ) {

            improvementValue =
                Math.round(
                    ((before - after) /
                    before) * 100
                );

        }


        improvement.textContent =
            improvementValue !== null
                ? `${improvementValue}%`
                : "--";


        /* CHALLENGE */

        const challengeCount =
            document.getElementById(
                "challengeCount"
            );


        const challengeFill =
            document.getElementById(
                "challengeProgressFill"
            );


        challengeCount.textContent =
            `${completedDays.length}/7`;


        challengeFill.style.width =
            `${Math.round(
                (completedDays.length / 7) * 100
            )}%`;


        /* COMPARISON */

        const beforeBar =
            document.getElementById(
                "beforeBar"
            );


        const afterBar =
            document.getElementById(
                "afterBar"
            );


        const beforeLabel =
            document.getElementById(
                "beforeLabel"
            );


        const afterLabel =
            document.getElementById(
                "afterLabel"
            );


        if (before !== null) {

            beforeLabel.textContent =
                `${before}/15`;

            beforeBar.style.width =
                `${(before / 15) * 100}%`;

        }


        if (after !== null) {

            afterLabel.textContent =
                `${after}/15`;

            afterBar.style.width =
                `${(after / 15) * 100}%`;

        }


        /* STATUS */

        const statusIcon =
            document.getElementById(
                "statusIcon"
            );


        const statusTitle =
            document.getElementById(
                "statusTitle"
            );


        const statusMessage =
            document.getElementById(
                "statusMessage"
            );


        if (before === null) {

            statusIcon.textContent =
                "🌱";

            statusTitle.textContent =
                "Start with your survey";

            statusMessage.textContent =
                "Complete the first survey to understand your current plastic-use behaviour.";

        }

        else if (after === null) {

            statusIcon.textContent =
                "🚀";

            statusTitle.textContent =
                "Your journey has started";

            statusMessage.textContent =
                `Your starting score is ${before}/15. Complete the 7-day challenge and take the after survey to measure your progress.`;

        }

        else if (improvementValue > 0) {

            statusIcon.textContent =
                "🎉";

            statusTitle.textContent =
                "Great progress!";

            statusMessage.textContent =
                `Your Plastic Usage Behaviour Score improved by ${improvementValue}%. Keep following the habits you developed.`;

        }

        else if (improvementValue === 0) {

            statusIcon.textContent =
                "🌿";

            statusTitle.textContent =
                "Keep working on it";

            statusMessage.textContent =
                "Your before and after scores are the same. Continue practising small daily changes.";

        }

        else {

            statusIcon.textContent =
                "💪";

            statusTitle.textContent =
                "Keep improving";

            statusMessage.textContent =
                "Your score increased after the challenge. Continue practising reusable and lower-plastic habits.";

        }

    }

});