import * as css from './index.css'
import Viva from "vivagraphjs";

export default class App {
  constructor (elem) {
    if (!elem) return;
    this.elem = elem;
    this.defaultIconSize = 50;
    this.defaultURL = "https://ibb.co/68dTG9c";  // URL аватарки по умолчанию

    this.graphics = Viva.Graph.View.svgGraphics();
    this.graphics.node(function(node) {
      // Настройка для отображения узлов графа
      return Viva.Graph.svg('image')
          .attr('width', node.data["size"])  // Размер узла зависит от значения size
          .attr('height', node.data["size"])
          .link(node.data.url);  // Ссылка на аватарку
    })
        .placeNode(function(nodeUI, pos) {
          // Сдвигаем изображение, чтобы оно корректно располагалось
          nodeUI.attr('x', pos.x - 12).attr('y', pos.y - 12);
        });
  }

  // Рекурсивная функция добавления узлов в граф
  addNodesToGraph(root_user, followers, graph, depth = 0, maxDepth = 2) {
    if (depth > maxDepth) return;  // Прерываем рекурсию, если достигнут лимит глубины

    const getDataFromPerson = (person) => {
      return {
        url: person["avatar_url"] || this.defaultURL,
        size: person["size"] || this.defaultIconSize  // Размер фолловера
      };
    };

    graph.addNode(root_user, getDataFromPerson({"login": root_user}));

    // Перебираем фолловеров
    for (const person of followers) {
      if (!graph.getNode(person["login"])) {
        graph.addNode(person["login"], getDataFromPerson(person));
      }
      graph.addLink(root_user, person["login"]);

      // Рекурсивно добавляем фолловеров фолловеров
      if (person["followers"]) {
        this.addNodesToGraph(person["login"], person["followers"], graph, depth + 1, maxDepth);
      }
    }
  }

  // Основная функция рендеринга
  render (root_user, followers) {
    const graph = Viva.Graph.graph();
    this.addNodesToGraph(root_user, followers, graph);

    const layout = Viva.Graph.Layout.forceDirected(graph, {
      springLength : 200,  // Длинна пружины
      springCoeff : 0.00001,
      dragCoeff : 0.002,
      gravity : -112.5  // Притяжение
    });

    const renderer = Viva.Graph.View.renderer(graph, {
      container: document.querySelector(".graph-container"),
      layout: layout,
      graphics: this.graphics
    });
    renderer.run();
  }
}
