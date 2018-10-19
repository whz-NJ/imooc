$(function() {
    // 处理删除电影数据的逻辑
    $(".del").click(function(e) {
        var target = $(e.target);  // 哪个按钮
        var id = target.data('id'); // 按钮的data-id属性
        var tr = $(".item-id-" + id); // 拿到表格中的这一行
        $.ajax({
            type: 'DELETE', // 异步请求类型：删除
            url: '/admin/list?id=' + id
        }).done(function(res) {
            if (res.success === 1) {
                if (tr.length > 0) {
                    tr.remove();
                }
            }
        })
    })
})
