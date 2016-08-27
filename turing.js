"use strict";

class Machine {
    constructor (map, tuples, statenames) {
        this.map = map;
        this.tuples = tuples;
        this.statenames = statenames;
    }
}
function build_machine(src) {
    var map = new Map();
    var tuples = [];
    var statenames = [];
    src.forEach((line) => {
       var m = line.match(/(\S+) +(\S+) +(\S+) +(\S+) +(\S+)/);
       var [q0, s0, s1, a, q1] = m.slice(1);
       map.set(q0+","+s0, [s1, a, q1]);
       tuples.push([q0, s0, s1, a, q1]);
       if (!statenames.includes(q0)) statenames.push(q0);
       if (!statenames.includes(q1)) statenames.push(q1);
    });
    return new Machine(map, tuples, statenames);
}

function run(machine, tapestr, pos, statenodes, edges, dolater) {
    var q = "0";
    var tape = tapestr.split("");
    var prevedge = null;
    function step() {
        var s = tape[pos] || "_";
        var tuple = machine.map.get(q+","+s);
        if (!tuple) return;
        var [s1, a, newq] = tuple;
        var newpos = pos;
        if (a == "L") {
            newpos --;
        } else if (a == "R") {
            newpos ++;
        }
        $("path", edges.get(q+","+s)).attr("stroke", "red");
        $("polygon", edges.get(q+","+s)).attr("fill", "red").attr("stroke", "red");
        prevedge = edges.get(q+","+s);

        dolater(() => {
            $("path", prevedge).attr("stroke", "black");
            $("polygon", prevedge).attr("fill", "black").attr("stroke", "black");
            change_tape_ui(pos, s1, newpos);
            $("ellipse", statenodes.get(q)).attr("fill", "none");
            $("ellipse", statenodes.get(newq)).attr("fill", "yellow");
            tape[pos] = s1;
            pos = newpos;
            q = newq;
            dolater(step);
        });

    }
    $("ellipse", statenodes.get(q)).attr("fill", "yellow");
    dolater(() => {
        step();
    });
}

function build_tape_ui(text, pos) {
    var $table = $("<table id='tape'/>");
    var $trs = [$("<tr/>"), $("<tr/>")];
    $trs.forEach(($tr, i) => {
        for (var j = 0; j < 20; j ++) {
            var $td = $("<td/>").attr("id", "tape-"+i+"-"+j);
            if (i == 0) {
                if (j == pos) {
                    $td.html("<span id='cursor' style='font-size:50%'>▼</span>");
                }
            } else {
                $td.text(text[j] || "_");
            }
            $tr.append($td);
        }
        $table.append($tr);
    });
    $("body").append($table);
}

function change_tape_ui(pos, symbol, newpos) {
    $("#tape-1-"+pos).text(symbol);
    $("#tape-0-"+newpos).append($("#cursor"));
}

function build_statenodes(machine) {
    var statenodes = new Map();
    var $nodes = $(".node");
    [...$nodes].forEach((node) => {
        var [_, name] = $("title", node).text().match(/_(\w+)/);
        statenodes.set(name, node);
    });
    return statenodes;
}

function build_edges(machine) {
    var edges = new Map();
    var $edges = $(".edge");
    [...$edges].forEach((edge) => {
        var [_, name1, name2] = $("title", edge).text().match(/_(\w+)->_(\w+)/);
        var [symbol] = $("text", edge).text().match(/\S+/);
        edges.set(name1+","+symbol, edge);
    });
    return edges;
}

$(() => {
   var machine = build_machine(MACHINE_SRC);
   var tape = TAPE;
   var pos = POS;
   var statenodes = build_statenodes(machine);
   var edges = build_edges(machine);
   build_tape_ui(tape, pos);
   var task = null;
   var dolater = (fn) => {
       task = fn;
   };
   //dolater = (fn) => {setTimeout(fn, 50)};
   $("body").click(() => {
       task();
   }).keydown((e) => {
       if (e.key == "ArrowDown") {
           task();
       }
   });
   run(machine, tape, pos, statenodes, edges, dolater);
});