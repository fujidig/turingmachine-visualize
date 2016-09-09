
a = <<EOS
  0        _       _       L       1
  0        1       _       L       1
  0        X       _       L       1
  1        _       1       L       2
  1        1       1       L       2
  1        X       1       L       2
  2        _       1       R       3
  2        1       1       R       3
  2        X       1       R       3
  3        _       _       N       4
  3        1       1       R       3
  3        X       X       R       3
  4        _       _       R       5
  4        1       1       R       4
  4        X       X       R       4
  5        _       _       L       6
  5        1       1       L       7
  5        X       X       R       5
  6        _       X       L       18
  6        1       1       L       6
  6        X       1       L       6
  7        _       _       L       8
  7        1       1       L       7
  7        X       X       L       7
  8        _       _       R       12
  8        1       X       R       9
  8        X       X       L       8
  9        _       _       R       10
  9        1       1       R       9
  9        X       X       R       9
  10      _       _       L       13
  10      1       X       L       11
  10      X       X       R       10
  11      _       _       L       8
  11      1       1       L       11
  11      X       X       L       11
  12      _       _       R       5
  12      1       1       R       12
  12      X       1       R       12
  13      _       _       L       14
  13      1       1       L       13
  13      X       1       L       13
  14      _       _       R       15
  14      1       1       L       14
  14      X       1       L       14
  15      _       _       L       16
  15      1       1       R       15
  15      X       1       R       15
  16      _       1       R       17
  16      1       1       L       16
  16      X       X       N       16
  17      _       _       N       4
  17      1       1       R       17
  17      X       X       N       17
  18      _       _       R       20
  18      1       1       L       18
  18      X       X       L       18
  19      _       _       L       21
  19      1       1       R       19
  19      X       X       R       19
  20      _       _       N       20
  20      1       _       R       19
  20      X       X       R       22
  21      _       _       N       21
  21      1       _       L       18
  21      X       X       N       21
  22      _       _       L       stop
  22      1       1       L       23
  22      X       X       N       22
  23      _       _       N       23
  23      1       1       N       23
  23      X       _       N       stop
EOS

b = a.lines.map{|x|
  m = x.match(/(\S+) +(\S+) +(\S+) +(\S+) +(\S+)/)
  m.to_a[1..-1]
}

states = (b.map{|x| x[0] } + b.map{|x| x[4] }).uniq

puts "digraph sample {"
puts "graph [rankdir = LR];"

states.each do |s|
  puts "_#{s} [label=\"#{s}\"];"
end


b.each do |m|
  q1, s1, s2, ac, q2 = m
  puts "_#{q1} -> _#{q2} [label = \"#{s1} #{s2} #{ac}\"];"
end
puts "}"