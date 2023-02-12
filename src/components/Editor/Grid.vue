<template>
    <div :class="{ 'external-border': isPhone }">
        <div :class="{ home: isPhone }">
            <div><i :class="{ 'el-icon-menu': isPhone }"></i></div>
            <div><i :class="{ 'el-icon-s-home': isPhone }"></i></div>
            <div><i :class="{ 'el-icon-arrow-left': isPhone }"></i></div>
        </div>
        <div class="inner-border">
            <svg class="grid" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
                <defs>
                    <pattern id="smallGrid" width="7.236328125" height="7.236328125" patternUnits="userSpaceOnUse">
                        <path d="M 7.236328125 0 L 0 0 0 7.236328125" fill="none" stroke="rgba(207, 207, 207, 0.3)" stroke-width="1"></path>
                    </pattern>
                    <pattern id="grid" width="36.181640625" height="36.181640625" patternUnits="userSpaceOnUse">
                        <rect width="36.181640625" height="36.181640625" fill="url(#smallGrid)"></rect>
                        <path
                            d="M 36.181640625 0 L 0 0 0 36.181640625"
                            fill="none"
                            stroke="rgba(186, 186, 186, 0.5)"
                            stroke-width="1"
                        ></path>
                    </pattern>
                </defs>
                <rect width="100%" height="100%" fill="url(#grid)"></rect>
            </svg>
        </div>
    </div>
</template>
<script>
import { mapState } from 'vuex'
export default {
    methods: {},
    computed: {
        ...mapState({ isPhone: 'isPhone' }),
    },
}
</script>
<style lang="scss" scoped>
.grid {
    position: absolute;
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
}

.external-border {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    border: 1px solid #000;
    border-radius: 30px;
    /* z-index: 1; */

    .inner-border {
        position: absolute;
        top: 49%;
        left: 50%;
        transform: translate(-50%, -50%);
        width: 92%;
        height: 84%;
        border: 1px solid #000;
    }
    .home {
        position: absolute;
        display: flex;
        justify-content: center;
        width: 95%;
        height: 8%;
        bottom: 0;
        left: 2.5%;
        border-radius: 40px;
        z-index: 0;
        div {
            position: relative;
            border-radius: 40px;
            flex: 1;
            i {
                position: absolute;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                /* background-color: pink; */
            }
        }
    }
}
</style>
