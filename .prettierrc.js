module.exports = {
    // tab缩进大小,默认为2
    tabWidth: 4,
    // 使用tab缩进，默认false
    useTabs: false,
    printWidth: 140,
    semi: false, // 结尾不用分号
    singleQuote: true, // 使用单引号
    disableLanguages: ['vue'], // 不格式化vue文件，vue文件的格式化单独设置
    htmlWhitespaceSensitivity: 'ignore',
    // trailingComma: 'none' // 函数后面不加逗号，如果不写这一个，在methods 最后一个函数也会加逗号，eslint会报错，多了一个逗号
}
