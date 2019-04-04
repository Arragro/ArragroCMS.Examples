import { TimelineLite, TimelineMax, Linear, TweenLite } from 'gsap'

const allClouds = new TimelineLite()
const startTimings = [50, 64, 58, 47]
const timings = [60, 74, 68, 77, 60, 74, 68, 77]
const delays = [8, 18, 10, 20, 32, 46, 49, 40, 55]
const animatedCloudStartingLeft = [44, 2, 65, 5]
// const animatedCloudLeft = [-68, -120, -82, -134, -68, -120, -82, -134]

export function processStartClouds (startClouds, speedFactor: number = 1) {
    for (let i = 0; i < startClouds.length; i++) {
        // dynamically create a cloud element
        let cloud = startClouds[i]

        // set its initial position and opacity using GSAP
        TweenLite.set(cloud, { left: animatedCloudStartingLeft[i].toString() + '%', opacity: 0 })
        // create a repeating timeline for this cloud
        let cloudTl = new TimelineMax({ repeat: 0 })
        // fade opacity to 1
        cloudTl.to(cloud, 3, { opacity: 1 })
            // move cloud across its container div with random duration. Start time = 0
            .to(cloud, (startTimings[i] * speedFactor), { left: '100%', ease: Linear.easeNone }, 0)
            // 0.5 seconds before timeline ends start fading opacity to 0
            .to(cloud, .5, { opacity: 0 }, '-=0.5')
        // add this cloud's timeline to the allClouds timeline at a random start time.
        allClouds.add(cloudTl, 0)
    }
}

export function processInfiniteClouds (infiniteClouds) {

    // loop through creation of 10 clouds
    for (let i = 0; i < infiniteClouds.length; i++) {
        // dynamically create a cloud element
        let cloud = infiniteClouds[i]

        // set its initial position and opacity using GSAP
        TweenLite.set(cloud, { left: '0%', opacity: 0 })
        // create a repeating timeline for this cloud
        let cloudTl = new TimelineMax({ repeat: -1 })
        // fade opacity to 1
        cloudTl.to(cloud, 3, { opacity: 1 })
            // move cloud across its container div with random duration. Start time = 0
            .to(cloud, timings[i], { left: '100%', ease: Linear.easeNone }, 0)
            // 0.5 seconds before timeline ends start fading opacity to 0
            .to(cloud, .5, { opacity: 0 }, '-=0.5')
        // add this cloud's timeline to the allClouds timeline at a random start time.
        allClouds.add(cloudTl, delays[i])
    }
}
