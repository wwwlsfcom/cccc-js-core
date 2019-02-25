/*
 包含Web2D图形绘制及操作的接口
 */
let temp = (function () {

  /*
  将一组点依次连接起来形成路径
   */
  let createPath = function (points) {
    if (typeof (points) == 'undefined' || !(points instanceof Array) || points.length == 0)
      return;
    let path = new Path2D();
    path.moveTo(points[0].x, points[0].y);
    for (let i = 0; i < points.length; i++)
      path.lineTo(points[i].x, points[i].y);

    return path;
  };

  //角度转弧度
  function degToRad(degrees) {
    return degrees * Math.PI / 180;
  };

  //在矩形中间绘制文本
  // function centerTextInRect({ctx, text, textColor = 'black', rect:{x, y, w, h}, font = 0}) {
  //   if (font)
  //     ctx.font = font;
  //   let textSize = ctx.measureText(text);
  //   ctx.textBaseline = 'middle';
  //   ctx.fillStyle = textColor;
  //   ctx.fillText(text, x + (w - textSize.width) / 2, y + h / 2);
  // }

  /**
   * 在矩形中间绘制文本
   * @param options : {ctx, text, textColor = 'black', rect:{x, y, w, h}, font = 0}
   */
  function centerTextInRect(options) {
    if (options.font)
      options.ctx.font = options.font;
    let textSize =options. ctx.measureText(options.text);
    options.ctx.textBaseline = 'middle';
    options.ctx.fillStyle = options.textColor;
    options.ctx.fillText(options.text, options.rect.x + (options.rect.w - textSize.width) / 2, options.rect.y + options.rect.h / 2);
  }

  //计算一组点所占区域的矩形边界
  function outerBound(points) {
    if (typeof points == 'undefined') return null;
    if (!points instanceof Array || points.length == 0)
      return null;
    let minX = points[0].x;
    let maxX = minX;
    let minY = points[0].y;
    let maxY = minY;

    points.forEach(function (p) {
      if (p.x < minX)
        minX = p.x;
      else if (p.x > maxX)
        maxX = p.x;
      if (p.y < minY)
        minY = p.y;
      else if (p.y > maxY)
        maxY = p.y;
    });

    return {
      x: minX, y: minY, w: maxX - minX, h: maxY - minY
    }
  }

  /**
   * 多边形构造函数
   * options: {
                     ctx,  // CanvasRenderingContext2D类型绘图环境
                     fillColor = 'rgba(0,0,0,0)',
                     strokeColor = 'rgb(0,0,0)',
                     canvasColor,
                     lineWidth = 1
                   }
   */
  function Polygon(option) {
    for(let attr in option){
      eval( 'var ' + attr + ' = option.' + attr )
    }
    if (cccc.isUndefined(ctx) || !(ctx instanceof CanvasRenderingContext2D))
      throw '创建多边形Polygon时请提供CanvasRenderingContext2D类型绘图环境ctx选项';
    this.ctx = ctx;
    this.path = new Path2D();
    this.points = [];
    this.finished = false;
    this.fillColor = fillColor;
    this.strokeColor = strokeColor;
    this.lineWidth = lineWidth;
    this.canvasColor = canvasColor;
  };
  Polygon.prototype.addPoint = function (point) { //多边形添加点
    for(let attr in point){
      eval( 'var ' + attr + ' = point.' + attr )
    }
    if (this.finished)
      throw '多边形polygon已经完成绘制，不能再添加坐标点'
    this.points.push({x:x, y:y});
    this.redraw();
  };
  Polygon.prototype.finish = function () {//多边形完成绘制,在绘制最后必须调用此方法，调用finish后不能再调用addPoint
    let start = this.points[0];
    this.addPoint(start);
    this.finished = true;
  };
  Polygon.prototype.redraw = function () {
    if (this.points.length == 0)
      return;
    let start = this.points[0];
    this.path = new Path2D();
    this.path.moveTo(start.x, start.y);
    for (let i = 1; i < this.points.length; i++) {
      let p = this.points[i];
      this.path.lineTo(p.x, p.y);
    }
    this.ctx.save();
    this.ctx.fillStyle = this.fillColor;
    this.ctx.strokeStyle = this.strokeColor;
    this.ctx.lineWidth = this.lineWidth;
    this.ctx.fill(this.path);
    if (this.lineWidth > 0)
      this.ctx.stroke(this.path);
    this.ctx.restore();
  };
  Polygon.prototype.undo = function () {
    var savedStyle = {
      strokeColor: this.strokeColor,
      fillColor: this.fillColor
    };
    this.strokeColor = this.fillColor = this.canvasColor;
    this.redraw();
    this.points.pop();
    this.finished = false;
    this.strokeColor = savedStyle.strokeColor;
    this.fillColor = savedStyle.fillColor;
    this.redraw();
  };
  return {
    createPath: createPath,
    degToRad: degToRad,
    centerTextInRect: centerTextInRect,
    outerBound: outerBound,
    Polygon: Polygon
  };
}());
if (typeof cccc != 'undefined' && cccc)
  Object.assign(cccc, temp);
else
  cccc = temp;



