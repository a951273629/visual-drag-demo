<template>
    <div class="component-list" @dragstart="handleDragStart">
        <el-divider content-position="left" class="graph">图形</el-divider>

        <div v-for="(item, index) in listGraph" :key="item.component" class="list" draggable :data-key="item.component">
            <span v-if="item.icon.substr(0, 2) === 'el'" :class="item.icon"></span>
            <span v-else class="iconfont" :class="'icon-' + item.icon"></span>
        </div>
        <!-- 判断图形元素个数是不是奇数 奇数个就存在补位 偶数就不存在 -->
        <div v-if="isSupplement"></div>
        <el-divider content-position="left" class="component">组件</el-divider>
        <div v-for="(item, index) in listComponent" :key="item.component" class="list" draggable :data-key="item.component">
            <span v-if="item.icon.substr(0, 2) === 'el'" :class="item.icon"></span>
            <span v-else class="iconfont" :class="'icon-' + item.icon"></span>
        </div>
    </div>
</template>

<script>
// import componentList from '@/custom-component/component-list'
import { listGraph, listComponent } from '@/custom-component/component-list'

export default {
    data() {
        return {
            listGraph,
            listComponent,
            isSupplement: false,
        }
    },
    created() {
        if (this.listGraph.length % 2 === 1) {
            this.isSupplement = true
        }
    },
    methods: {
        // 拖动组件时拿到自定义属性 data-key 把key值传到Home.vue中
        handleDragStart(e) {
            console.log(e.target.dataset.key)
            e.dataTransfer.setData('key', e.target.dataset.key)
        },
    },
}
</script>

<style lang="scss" scoped>
.component-list {
    height: 65%;
    padding: 10px;
    display: grid;
    grid-gap: 10px 19px;
    grid-template-columns: repeat(auto-fill, 80px);
    grid-template-rows: repeat(auto-fill, 40px);
    grid:
        'graph graph'
        '. .'
        '. .'
        '. .'
        'component component';
    .graph {
        grid-area: graph;
        /* height: 40px; */
    }
    .component {
        grid-area: component;
        /* height: 40px; */
    }
    .list {
        width: 80px;
        height: 40px;
        border: 1px solid #ddd;
        cursor: grab;
        text-align: center;
        color: #333;
        padding: 2px 5px;
        display: flex;
        align-items: center;
        justify-content: center;

        &:active {
            cursor: grabbing;
        }

        .iconfont {
            margin-right: 4px;
            font-size: 20px;
        }

        .icon-wenben,
        .icon-biaoge {
            font-size: 18px;
        }

        .icon-tupian {
            font-size: 16px;
        }
    }
}
</style>
