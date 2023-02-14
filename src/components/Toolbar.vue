<template>
    <div>
        <div class="toolbar">
            <el-button type="primary" @click="handleAceEditorChange">JSON</el-button>
            <el-button type="primary" @click="undo">撤消</el-button>
            <el-button type="primary" @click="redo">重做</el-button>
            <label for="input" class="insert">
                插入图片
                <input id="input" type="file" hidden @change="handleFileChange" />
            </label>

            <el-button type="primary" style="margin-left: 10px" @click="preview(false)">预览</el-button>

            <!-- 保存代码 -->
            <el-dropdown class="dropdown" size="small" split-button type="primary" @command="save">
                导入\导出
                <el-dropdown-menu slot="dropdown">
                    <el-dropdown-item command="local">导出到本地</el-dropdown-item>
                    <el-dropdown-item command="server">导出到服务器</el-dropdown-item>
                    <el-dropdown-item command="importLocal">本地导入</el-dropdown-item>
                </el-dropdown-menu>
                <input
                    type="file"
                    accept="application/json"
                    style="visibility: hidden; height: 0px; width: 0px"
                    ref="fileRead"
                    @change="fileRead"
                />
            </el-dropdown>

            <el-button type="primary" @click="clearCanvas">清空画布</el-button>
            <el-button type="primary" :disabled="!areaData.components.length" @click="compose">组合</el-button>
            <el-button
                type="primary"
                :disabled="!curComponent || curComponent.isLock || curComponent.component != 'Group'"
                @click="decompose"
            >
                拆分
            </el-button>

            <el-button type="primary" :disabled="!curComponent || curComponent.isLock" @click="lock">锁定</el-button>
            <el-button type="primary" :disabled="!curComponent || !curComponent.isLock" @click="unlock">解锁</el-button>
            <el-button type="primary" @click="preview(true)">截图</el-button>

            <!-- 选择屏幕按钮 -->
            <el-dropdown class="dropdown" size="small" split-button type="primary" @command="screenCategory">
                {{ screenName }}
                <el-dropdown-menu slot="dropdown">
                    <el-dropdown-item command="phone">手机屏幕</el-dropdown-item>
                    <el-dropdown-item command="pc">电脑屏幕</el-dropdown-item>
                </el-dropdown-menu>
            </el-dropdown>

            <div class="canvas-config">
                <span>画布大小</span>
                <input v-model="canvasStyleData.width" />
                <span>*</span>
                <input v-model="canvasStyleData.height" />
            </div>

            <div class="slider">
                <span>画布比例</span>
                <el-slider class="canvas-slider" v-model="scale" show-input @change="handleScaleChange"></el-slider>
            </div>
        </div>

        <!-- 预览 -->
        <Preview v-if="isShowPreview" :is-screenshot="isScreenshot" @close="handlePreviewChange" />
        <AceEditor v-if="isShowAceEditor" @closeEditor="closeEditor" />
    </div>
</template>

<script>
import generateID from '@/utils/generateID'
import toast from '@/utils/toast'
import { mapState } from 'vuex'
import Preview from '@/components/Editor/Preview'
import AceEditor from '@/components/Editor/AceEditor.vue'
import { commonStyle, commonAttr } from '@/custom-component/component-list'
import eventBus from '@/utils/eventBus'
import { $ } from '@/utils/utils'
import { saveAs } from 'file-saver'
import changeComponentsSizeWithScale, { changeComponentSizeWithScale } from '@/utils/changeComponentsSizeWithScale'

export default {
    components: { Preview, AceEditor },
    data() {
        return {
            isShowPreview: false,
            isShowAceEditor: false,
            timer: null,
            isScreenshot: false,
            scale: 100,
            screenName: '手机屏幕',
        }
    },
    computed: mapState(['componentData', 'canvasStyleData', 'areaData', 'curComponent', 'curComponentIndex', 'isPhone']),
    created() {
        eventBus.$on('preview', this.preview)
        eventBus.$on('save', this.save)
        eventBus.$on('clearCanvas', this.clearCanvas)

        this.scale = this.canvasStyleData.scale
    },
    // updated() {
    //     this.scale = this.canvasStyleData.scale
    // },
    methods: {
        handleScaleChange() {
            clearTimeout(this.timer)
            this.timer = setTimeout(() => {
                // 画布比例设一个最小值，不能为 0
                // eslint-disable-next-line no-bitwise
                this.scale = ~~this.scale || 1
                changeComponentsSizeWithScale(this.scale)
            }, 100)
        },

        handleAceEditorChange() {
            this.isShowAceEditor = !this.isShowAceEditor
        },

        closeEditor() {
            this.handleAceEditorChange()
        },

        lock() {
            this.$store.commit('lock')
        },

        unlock() {
            this.$store.commit('unlock')
        },

        compose() {
            this.$store.commit('compose')
            this.$store.commit('recordSnapshot')
        },

        decompose() {
            this.$store.commit('decompose')
            this.$store.commit('recordSnapshot')
        },

        undo() {
            this.$store.commit('undo')
        },

        redo() {
            this.$store.commit('redo')
        },

        handleFileChange(e) {
            const file = e.target.files[0]
            if (!file.type.includes('image')) {
                toast('只能插入图片')
                return
            }

            const reader = new FileReader()
            reader.onload = (res) => {
                const fileResult = res.target.result
                const img = new Image()
                img.onload = () => {
                    const component = {
                        ...commonAttr,
                        id: generateID(),
                        component: 'Picture',
                        label: '图片',
                        icon: '',
                        propValue: {
                            url: fileResult,
                            flip: {
                                horizontal: false,
                                vertical: false,
                            },
                        },
                        style: {
                            ...commonStyle,
                            top: 0,
                            left: 0,
                            width: img.width,
                            height: img.height,
                        },
                    }

                    // 根据画面比例修改组件样式比例 https://github.com/woai3c/visual-drag-demo/issues/91
                    changeComponentSizeWithScale(component)

                    this.$store.commit('addComponent', { component })
                    this.$store.commit('recordSnapshot')

                    // 修复重复上传同一文件，@change 不触发的问题
                    $('#input').setAttribute('type', 'text')
                    $('#input').setAttribute('type', 'file')
                }

                img.src = fileResult
            }

            reader.readAsDataURL(file)
        },

        preview(isScreenshot) {
            this.isScreenshot = isScreenshot
            this.isShowPreview = true
            this.$store.commit('setEditMode', 'preview')
        },
        // 保存到本地或者服务器
        save(saveCategory) {
            let componentDate = JSON.stringify({ canvasData: this.componentData, canvasStyle: this.canvasStyleData })

            if (saveCategory === 'local') {
                let file = new File([componentDate], 'Procode.json', { type: 'application/json' })
                // 保存到本地
                saveAs(file)
            } else if (saveCategory === 'importLocal') {
                this.importLocal()
                return
            } else {
            }
            this.$message.success('保存成功')
        },
        // 打卡选择文件的文件管理器
        importLocal() {
            this.$refs.fileRead.click()
        },
        // 本地数据导入到页面
        async fileRead() {
            let message = this.$message
            let result = new Promise((resolve, reject) => {
                const file = this.$refs.fileRead.files[0]

                if (!file) {
                    reject('没有选择任何文件')
                }
                let reader = new FileReader()
                reader.readAsText(file)
                reader.onload = function (evt) {
                    const fileStr = evt.target.result
                    if (fileStr) resolve(fileStr)
                    else reject(evt)
                }
            })
            // 使用async/await 这里的this就是Vue实例 加入用Promise.then那么这里的this是Promise
            try {
                let value = await result
                let canvas = JSON.parse(value)
                this.$store.commit('setCanvasData', canvas)
                message.success('读取成功')
            } catch (err) {
                console.log(err)
                message.error(err)
            }
        },
        clearCanvas() {
            this.$store.commit('setCurComponent', { component: null, index: null })
            this.$store.commit('setComponentData', [])
            this.$store.commit('recordSnapshot')
        },

        handlePreviewChange() {
            this.isShowPreview = false
            this.$store.commit('setEditMode', 'edit')
        },
        setScreenSize(screen = {}) {
            this.scale = screen.scale
            this.$store.commit('setScreenSize', screen)
            this.$store.commit('setIsPhone', screen.isPhone)
        },
        // 切换手机电脑屏幕
        screenCategory(category) {
            switch (category) {
                case 'phone':
                    this.screenName = '手机屏幕'

                    this.setScreenSize({ height: 960, width: 540, scale: 80, isPhone: true })
                    break

                case 'pc':
                    this.screenName = '电脑屏幕'
                    this.setScreenSize({ height: 740, width: 1200, scale: 100, isPhone: false })
                    break
            }
            // this.$message('click on item ' + category)
        },
    },
}
</script>

<style lang="scss" scoped>
.toolbar {
    padding: 15px 10px;
    white-space: nowrap;
    overflow-x: auto;
    background: #fff;
    border-bottom: 1px solid #ddd;
    position: relative;
    .slider {
        position: absolute;
        top: 34%;
        left: 60%;
        transform: translateY(-47%);
        display: inline-block;
        margin-left: 50px;
        width: 500px;
        span {
            position: absolute;
            left: 13%;
            display: inline-block;
            font-size: 14px;
            color: #606266;
        }
        .canvas-slider {
            position: absolute;
            left: 25%;
            transform: translateY(-20%);
            width: 400px;
        }
    }
    .dropdown {
        margin-left: 15px;
        margin-right: 15px;
    }

    .canvas-config {
        display: inline-block;
        margin-left: 10px;
        font-size: 14px;
        color: #606266;

        input {
            width: 50px;
            margin-left: 4px;
            outline: none;
            padding: 0 5px;
            border: 1px solid #ddd;
            color: #606266;
        }

        span {
            margin-left: 10px;
        }
    }

    .insert {
        display: inline-block;
        line-height: 1;
        white-space: nowrap;
        cursor: pointer;
        background: #409eff;
        border: 1px solid #dcdfe6;
        color: #fff;
        appearance: none;
        text-align: center;
        box-sizing: border-box;
        outline: 0;
        margin: 0;
        transition: 0.1s;
        font-weight: 500;
        padding: 9px 15px;
        font-size: 12px;
        border-radius: 3px;
        margin-left: 10px;

        &:active {
            color: #ffffff;
            border-color: #3a8ee6;
            outline: 0;
        }

        &:hover {
            background-color: #66b1ff;
            color: #e6ffff;
        }
    }
}
</style>
