# Пересечение полигонов
## Тестовое задание №2 для сообщества [Kottans](http://kottans.org/)

### Базовая информация
* Представленый код является решением задания №2 на соискание ученического места среди сообщества программистов [Kottans](http://kottans.org/).
* Точное описание задания Вы можете найти [здесь](https://gist.github.com/xanf/6ac4646ba2f6d781099b).
* В коде реализована функция intersect(), которая принимает в качестве аргументов 2 многоугольника, и возвращает массив многоугольников их пересечения.
* В допoленение к коду сообществом была предоставлена простая система визуализации работы функции на базе векторной веб-графики SVG.
* Функция является реализацией [алгоритма Уайлера — Атертона](https://en.wikipedia.org/wiki/Weiler%E2%80%93Atherton_clipping_algorithm), суть которого заключается в циклическом обходе двух списков обоюдного соотношения граней полигонов.

### Опорные методы работы
* Представленный код использует алгоритм [Ray Cast](https://en.wikipedia.org/wiki/Point_in_polygon#Ray_casting_algorithm) для разрешения проблемы наличия точки в полигоне.
* Для нахождения пересечения двух граней разных полигонов использован алгоритм MIT, сама реализация является переработаным вариантом функции [justin_c_rounds](http://jsfiddle.net/user/justin_c_rounds/fiddles/).
* Для определения характера касания точки к грани полигона использована Теорема Пифагора :).
* **Код не претендует на уважение со стороны опытных программистов и во многих своих элементах является ~~гавнокодом~~ плохим кодом, с явной ориентацией автора на костыльориентированную парадигму программирования.**

### Баги и недоработки
* В данный момент код не всегда возвращает корректные значения в случае работы самопересекающимся полигонами, детальней читайте в FAQ.
* Код возращает некорректные значения если два полигона делат одну вершину и она есть началом их пересечения (интерпретация простого внешнего касания вершин происходит правильно).
* Более глубокий баг-трэкинг будет продолжен позже.

### FAQ

- *Почему ты сделал два задания?*

Дело в том что я часто сомневаюсь в своих силах в области программирования. Я занимаюсь кодом около 5 месяцев и не имею технического образования, данное задание являлось для меня личной проверкой сил, ведь оно на порядок сложнее чем [задание №1](https://docs.google.com/document/d/15UzM6jsXQ8sAB8IQCvKZnDVXukcAL878Q36VqcITi3Y/edit). Я хотел доказать себе что могу не только карусельки верстать, но и реализовать алгоритм.

- *Все ли ты сделал сам?*

Несколько небольших элементов кода описаны в пункте "Опорные методы работы" были позаимствованы мной у других программистов. Тем не менее я детально проанализировал принцип их работы и частично описал его в комментариях. Большинство этих элементов были также переработаны мной под нужды конкретно этого задания. Возможно бы мог сдалать их сам, но боялся проблем с оптимизацией и багами, ведь они используются моей функцией достаточно часто.

- *Почему не решил проблему с самопересекающемися полигонами и с общими вершинами?*

Честно говоря, я потратил на этот код очень много времени, а главное сил. В теории (и на практике), я бы мог решить задачу с самопересечением (разбить ламаный полигон на простые полигоны и рекурсивно/циклически вызвать intersect() для каждого из них), и даже задачу с вершинами (заставить код интепретировать одинаковые вершины с внутренней прилегающей гранью как пересечение), но откровенно я просто очень устал от конкретно этого кода.

## Ссылка на [gh-pages](http://lempiy.github.io/task-2/).

## Если Вам интересна моя реализация задания №1 - Pokedex смотрите [этот](https://github.com/lempiy/lempiy.github.io) репозиторий.


