// sample_008
//
// WebGL

onload = function(){
    var c = document.getElementById('canvas');
    c.width = 500;
    c.height = 300;

    var gl = c.getContext('webgl') || c.getContext('experimental-webgl');

    var v_shader = create_shader('vs');
    var f_shader = create_shader('fs');

    var prg = create_program(v_shader, f_shader);

    var attLocation = new Array();
    attLocation[0] = gl.getAttribLocation(prg, 'position');
    attLocation[1] = gl.getAttribLocation(prg, 'color');

    var attStride = new Array();
    attStride[0] = 3;
    attStride[1] = 4;

    var torusData = torus(6, 6, 1.0, 2.0);
    var position = torusData[0];
    var color = torusData[1];
    var index = torusData[2];
    console.log(index)

    var pos_vbo = create_vbo(position);
    var col_vbo = create_vbo(color);

    set_attribute([pos_vbo, col_vbo], attLocation, attStride);

    var ibo = create_ibo(index);

    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, ibo);

    var uniLocation = gl.getUniformLocation(prg, 'mvpMatrix');

    var m = new matIV();

    var mMatrix = m.identity(m.create());
    var vMatrix = m.identity(m.create());
    var pMatrix = m.identity(m.create());
    var tmpMatrix = m.identity(m.create());
    var mvpMatrix = m.identity(m.create());

    m.lookAt([0.0, 0.0, 20.0], [0, 0, 0], [0, 1, 0], vMatrix);
    m.perspective(45, c.width / c.height, 0.1, 100, pMatrix);
    m.multiply(pMatrix, vMatrix, tmpMatrix);

    var count = 0;

    gl.enable(gl.DEPTH_TEST);
    gl.depthFunc(gl.LEQUAL);
    gl.enable(gl.CULL_FACE);

    (function(){
        gl.clearColor(0.0, 0.0, 0.0, 1.0);
        gl.clearDepth(1.0);
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

        count++;

        var rad = (count % 360) * Math.PI / 180;

        m.identity(mMatrix);
        m.rotate(mMatrix, rad, [0, 1, 1], mMatrix);
        m.multiply(tmpMatrix, mMatrix, mvpMatrix);
        gl.uniformMatrix4fv(uniLocation, false, mvpMatrix);
        gl.drawElements(gl.TRIANGLES, index.length, gl.UNSIGNED_SHORT, 0);
        gl.flush();

        setTimeout(arguments.callee, 1000 / 30);
    })();

    function create_shader(id){
        var shader;

        var scriptElement = document.getElementById(id);

        if(!scriptElement){return;}

        switch(scriptElement.type){

            case 'x-shader/x-vertex':
                shader = gl.createShader(gl.VERTEX_SHADER);
                break;

            case 'x-shader/x-fragment':
                shader = gl.createShader(gl.FRAGMENT_SHADER);
                break;
            default :
                return;
        }

        gl.shaderSource(shader, scriptElement.text);

        gl.compileShader(shader);

        if(gl.getShaderParameter(shader, gl.COMPILE_STATUS)){

            return shader;
        }else{

            alert(gl.getShaderInfoLog(shader));
        }
    }
    function create_program(vs, fs){

        var program = gl.createProgram();

        gl.attachShader(program, vs);
        gl.attachShader(program, fs);

        gl.linkProgram(program);

        if(gl.getProgramParameter(program, gl.LINK_STATUS)){

            gl.useProgram(program);

            return program;
        }else{

            alert(gl.getProgramInfoLog(program));
        }
    }

    function create_vbo(data){
        var vbo = gl.createBuffer();

        gl.bindBuffer(gl.ARRAY_BUFFER, vbo);

        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(data), gl.STATIC_DRAW);

        gl.bindBuffer(gl.ARRAY_BUFFER, null);

        return vbo;
    }

    function set_attribute(vbo, attL, attS){
        for(var i in vbo){
            gl.bindBuffer(gl.ARRAY_BUFFER, vbo[i]);

            gl.enableVertexAttribArray(attL[i]);

            gl.vertexAttribPointer(attL[i], attS[i], gl.FLOAT, false, 0, 0);
        }
    }

    function create_ibo(data){
        var ibo = gl.createBuffer();

        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, ibo);

        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Int16Array(data), gl.STATIC_DRAW);

        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);

        return ibo;
    }

    function torus(row, column, irad, orad){
        var pos = new Array(), col = new Array(), idx = new Array();
        for(var i = 0; i <= row; i++){
            var r = i*(Math.PI * 2 / row);
            var rr = Math.cos(r);
            var ry = Math.sin(r);
            for(var ii = 0; ii <= column; ii++){
                var tr = Math.PI * 2 / column * ii;
                var tx = (rr * irad + orad) * Math.cos(tr);
                var ty = ry * irad;
                var tz = (rr * irad + orad) * Math.sin(tr);
                pos.push(tx, ty, tz);
                var tc = hsva(360 / column * ii, 1, 1, 1);
                col.push(tc[0], tc[1], tc[2], tc[3]);
            }
        }
        for(i = 0; i < row; i++){
            for(ii = 0; ii < column; ii++){
                r = (column + 1) * i + ii;
                idx.push(r, r + column + 1, r + 1);
                idx.push(r + column + 1, r + column + 2, r + 1);
            }
        }
        return [pos, col, idx];
    }

    function hsva(h, s, v, a){
        if(s > 1 || v > 1 || a > 1){return;}
        var th = h % 360;
        var i = Math.floor(th / 60);
        var f = th / 60 - i;
        var m = v * (1 - s);
        var n = v * (1 - s * f);
        var k = v * (1 - s * (1 - f));
        var color = new Array();
        if(!s > 0 && !s < 0){
            color.push(v, v, v, a);
        } else {
            var r = new Array(v, n, m, m, k, v);
            var g = new Array(k, v, v, n, m, m);
            var b = new Array(m, m, k, v, v, n);
            color.push(r[i], g[i], b[i], a);
        }
        return color;
    }
};