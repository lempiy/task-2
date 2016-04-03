/* Приступая к просмотру даного кода важно понимать что он далеко не совершенен - 
 * часто встерчается гавнокод и приверженость кодера к костыльориентированой парадигме 
 * программирования. Но код работает, и, за исключением несколькихх багов,
 * возращает то, что нужно, а именно массив многоугольников пересичения. 

 * Код основан на алгоритме Уайлера — Атертона для клиппинга невыпуклых полигонов.
 * Также используется функция на основе метода Ray Cast для определения расположения 
 * точки внутри или снаружи полигона. И многое другое. Подробнее ниже */

/* Заранее извиняюсь за свою невнимательность и халатность. */

// Функция на основе Ray cast алгоритма для определения положения точки относительно полигона.
// из точки выпускается луч в произвольном направлении, если луч пересекает полигон нечетное 
// количество раз значит он внутри полигона.
function isPointInPoly(poly, pt){
    for(var c = false, i = -1, l = poly.length, j = l - 1; ++i < l; j = i)
        ((poly[i].y <= pt.y && pt.y < poly[j].y) || (poly[j].y <= pt.y && pt.y < poly[i].y))
        && (pt.x < (poly[j].x - poly[i].x) * (pt.y - poly[i].y) / (poly[j].y - poly[i].y) + poly[i].x)
        && (c = !c);
    return c;
}


//Функция для определения точки пересечения двух отрезков. С четырех точек образуется 2 прямые и определяется
//их точка пересечения. если эта точка находится в пространственном диапазоне двух отрезков (их условного четырехугольника),
//то отрезки можно считать пересекающимися и можно вернуть точку пересечения найденую ранее.
function checkLineIntersection(line1Start, line1End, line2Start, line2End) {
   
    var denominator, a, b, numerator1, numerator2, result = {
        x: null,
        y: null,
    };
    denominator = ((line2End.y - line2Start.y) * (line1End.x - line1Start.x)) - ((line2End.x - line2Start.x) * (line1End.y - line1Start.y));
    if (denominator == 0) {
        return false;
    }
    a = line1Start.y - line2Start.y;
    b = line1Start.x - line2Start.x;
    numerator1 = ((line2End.x - line2Start.x) * a) - ((line2End.y - line2Start.y) * b);
    numerator2 = ((line1End.x - line1Start.x) * a) - ((line1End.y - line1Start.y) * b);
    a = numerator1 / denominator;
    b = numerator2 / denominator;

   
    
    result.x = line1Start.x + (a * (line1End.x - line1Start.x));
   
    result.y = line1Start.y + (a * (line1End.y - line1Start.y));
    
    if (a > 0 && a < 1&&b > 0 && b < 1) {
        return result;
    }
    
    return false;
};

//Эта функция решает проблему с пересечением грани одного полигона через вершину другого полигона.
//В функции с получением списка пересечений вершина через которую проходит грань другого полигона,
//автоматически интерпретируется как пересечение
function isPointBetweenPoints(currPoint, point1, point2) {

    dxc = currPoint.x - point1.x;
    dyc = currPoint.y - point1.y;

    dxl = point2.x - point1.x;
    dyl = point2.y - point1.y;

    cross = dxc * dyl - dyc * dxl;

    if (cross != 0)
    return false;
    if (Math.abs(dxl) >= Math.abs(dyl))
      return dxl > 0 ? 
      point1.x <= currPoint.x && currPoint.x <= point2.x :
      point2.x <= currPoint.x && currPoint.x <= point1.x;
    else
      return dyl > 0 ? 
      point1.y <= currPoint.y && currPoint.y <= point2.y :
      point2.y <= currPoint.y && currPoint.y <= point1.y;
}


//Самый большой "кавалок" гавнокода:). Цикл в цикле в котором мы проверяем все пересичения, идентифицируем
//характер вершин (внутреняя или внешняя) и составляем список по часвой стрелке согласно алгоритму. В начале
//функции мы проверяем задан ли каждый полигон за часовой стрелкой, если нет, тогда делаем реверс массива.
//В конце "кавалка" стоит "костыль" который фильтрует дублированые значения в массиве.
function intersectsTest(fig1, fig2) {

  var sumOfEdges1 = fig1.map(function (point,index,array) {
    var i = index !== array.length-1 ? index+1 : 0;
    return (array[i].x - point.x)*(array[i].y + point.y);
  });
   var sumOfEdges2 = fig2.map(function (point,index,array) {
    var i = index !== array.length-1 ? index+1 : 0;
    return (array[i].x - point.x)*(array[i].y + point.y);
  });
  sumOfEdges1 = sumOfEdges1.reduce(function (preValue, curValue)  {
    return preValue + curValue;
  }, 0);
  sumOfEdges2 = sumOfEdges2.reduce(function (preValue, curValue)  {
    return preValue + curValue;
  }, 0);
  var reversedFig1 = fig1;
  var reversedFig2 = fig2;
  if(sumOfEdges1>0) {
    reversedFig1 = myReverse(fig1);
  }
  if(sumOfEdges2>0) {

    reversedFig2 = myReverse(fig2);
  }
  var ineterSectionPoints = [];
  for(var i = 0; i < reversedFig1.length; i++) {
     
      for(var k = 0; k < reversedFig2.length; k++) {

        var indxI = i-1;
        var indxK = k-1;
        if (indxI<0) {
          indxI = reversedFig1.length - 1;
        } 
        if (indxK<0) {
          indxK = reversedFig2.length - 1;
        }
        reversedFig1[i].vertex = 'outside';
        ineterSectionPoints.push(reversedFig1[i]);
        
        if(reversedFig1[i+1]!==undefined&&reversedFig2[k+1]!==undefined){ 
            if(checkLineIntersection(reversedFig1[i], reversedFig1[i+1], reversedFig2[k], reversedFig2[k+1])) {
              var intsc = checkLineIntersection(reversedFig1[i], reversedFig1[i+1], reversedFig2[k], reversedFig2[k+1]);
              var moreIntsc = checkIfMoreIntersections(intsc, reversedFig1[i], reversedFig1[i+1], reversedFig2);
              ineterSectionPoints = ineterSectionPoints.concat(moreIntsc);
            }
            if(isPointBetweenPoints(reversedFig1[i], reversedFig2[k], reversedFig2[k+1])) {
              if(checkDotIntersectionType(reversedFig1[i], reversedFig1[indxI], reversedFig1[i+1], reversedFig2[k], reversedFig2[k+1])) {
                delete reversedFig1[i].vertex;
                reversedFig1[i].intersection = 'intersection';
                ineterSectionPoints.push(reversedFig1[i]);
              }
            }

            if(isPointBetweenPoints(reversedFig2[k], reversedFig1[i], reversedFig1[i+1])) {
              if(checkDotIntersectionType(reversedFig2[k], reversedFig2[indxK], reversedFig2[k+1], reversedFig1[i], reversedFig1[i+1])) {
                delete reversedFig2[k].vertex;
                reversedFig2[k].intersection = 'intersection';
                ineterSectionPoints.push(reversedFig2[k]);
              }
            }

            if(isPointInPoly(reversedFig2, reversedFig1[i])) {
              if(reversedFig1[i].intersection===undefined) {
                reversedFig1[i].vertex = 'inside';
              }
              ineterSectionPoints.push(reversedFig1[i]);
            }

          } else {
              if(reversedFig1[i+1]===undefined&&reversedFig2[k+1]===undefined) {
                  if(checkLineIntersection(reversedFig1[i], reversedFig1[0], reversedFig2[k], reversedFig2[0])) {
                    var intsc = checkLineIntersection(reversedFig1[i], reversedFig1[0], reversedFig2[k], reversedFig2[0]);
                    var moreIntsc = checkIfMoreIntersections(intsc, reversedFig1[i], reversedFig1[0], reversedFig2);
                    ineterSectionPoints = ineterSectionPoints.concat(moreIntsc);
                  }
                  if(isPointBetweenPoints(reversedFig1[i], reversedFig2[k], reversedFig2[0])) {
                    if(checkDotIntersectionType(reversedFig1[i], reversedFig1[indxI], reversedFig1[0], reversedFig2[k], reversedFig2[0])){
                      delete reversedFig1[i].vertex;
                      reversedFig1[i].intersection = 'intersection';
                      ineterSectionPoints.push(reversedFig1[i]);
                    }
                  }
                  if(isPointBetweenPoints(reversedFig2[k], reversedFig1[i], reversedFig1[0])) {
                    if(checkDotIntersectionType(reversedFig2[k], reversedFig2[indxK], reversedFig2[0], reversedFig1[i], reversedFig1[0])) {
                      delete reversedFig2[k].vertex;
                      reversedFig2[k].intersection = 'intersection';
                      ineterSectionPoints.push(reversedFig2[k]);
                    }
                  }
                  if(isPointInPoly(reversedFig2, reversedFig1[i])) {
                    if(reversedFig1[i].intersection===undefined) {
                      reversedFig1[i].vertex = 'inside';
                    }
                    ineterSectionPoints.push(reversedFig1[i]);                    
                  }
              } else if (reversedFig1[i+1]===undefined) {
                  if(checkLineIntersection(reversedFig1[i], reversedFig1[0], reversedFig2[k], reversedFig2[k+1])) {
                    var intsc = checkLineIntersection(reversedFig1[i], reversedFig1[0], reversedFig2[k], reversedFig2[k+1]);
                    var moreIntsc = checkIfMoreIntersections(intsc, reversedFig1[i], reversedFig1[0], reversedFig2);
                    ineterSectionPoints = ineterSectionPoints.concat(moreIntsc);
                  }
                  if(isPointBetweenPoints(reversedFig1[i], reversedFig2[k], reversedFig2[k+1])) {
                    if(checkDotIntersectionType(reversedFig1[i], reversedFig1[indxI], reversedFig1[0], reversedFig2[k], reversedFig2[k+1])) {
                      delete reversedFig1[i].vertex;
                      reversedFig1[i].intersection = 'intersection';
                      ineterSectionPoints.push(reversedFig1[i]);
                    }
                  }
                  if(isPointBetweenPoints(reversedFig2[k], reversedFig1[i], reversedFig1[0])) {
                    if(checkDotIntersectionType(reversedFig2[k], reversedFig2[indxK], reversedFig2[k+1], reversedFig1[i], reversedFig1[0])) {
                      delete reversedFig2[k].vertex;
                      reversedFig2[k].intersection = 'intersection';
                      ineterSectionPoints.push(reversedFig2[k]);
                    }
                  }
                  if(isPointInPoly(reversedFig2, reversedFig1[i])) {
                    if(reversedFig1[i].intersection===undefined) {
                      reversedFig1[i].vertex = 'inside';
                    }
                    ineterSectionPoints.push(reversedFig1[i]);
                  }
              } else if (reversedFig2[k+1]===undefined) {
                  if(checkLineIntersection(reversedFig1[i], reversedFig1[i+1], reversedFig2[k], reversedFig2[0])) {
                    var intsc = checkLineIntersection(reversedFig1[i], reversedFig1[i+1], reversedFig2[k], reversedFig2[0]);
                    var moreIntsc = checkIfMoreIntersections(intsc, reversedFig1[i], reversedFig1[i+1], reversedFig2);
                    ineterSectionPoints = ineterSectionPoints.concat(moreIntsc);
                  }
                  if(isPointBetweenPoints(reversedFig1[i], reversedFig2[k], reversedFig2[0])) {
                    if(checkDotIntersectionType(reversedFig1[i], reversedFig1[indxI], reversedFig1[i+1], reversedFig2[k], reversedFig2[0])) {
                      delete reversedFig1[i].vertex;
                      reversedFig1[i].intersection = 'intersection';
                      ineterSectionPoints.push(reversedFig1[i]);
                    }
                  }
                  if(isPointBetweenPoints(reversedFig2[k], reversedFig1[i], reversedFig1[i+1])) {
                    if(checkDotIntersectionType(reversedFig2[k], reversedFig2[indxK], reversedFig2[0], reversedFig1[i], reversedFig1[i+1])) {
                      delete reversedFig2[k].vertex;
                      reversedFig2[k].intersection = 'intersection';
                      ineterSectionPoints.push(reversedFig2[k]);
                    }
                  }
                  if(isPointInPoly(reversedFig2, reversedFig1[i])) {
                    if(reversedFig1[i].intersection===undefined) {
                      reversedFig1[i].vertex = 'inside';
                    }
                    ineterSectionPoints.push(reversedFig1[i]);
                  }
              }
          } 
      }
  }


  filtredArray = filterDuplicates(ineterSectionPoints);
  for(var g = 0; g<filtredArray.length;g++) {
    if(filtredArray[g].intersection===undefined) {
      if(checkTouchDot(filtredArray[g], reversedFig2)) {
        if(isIntersectInOrOutOfPolygon(g, filtredArray, reversedFig2)) {
          filtredArray[g].vertex = 'outside';
        } else {
          filtredArray[g].vertex = 'inside';
        }
      }
    }
  }


  return filtredArray;
}

//Входящая функция интерсект вызывает два списка - по соотношению 1го полигона к 2ому и наоборот.
//Дальше проверяет ни включает ли полностью полигон А полигон Б или полигон Б полигон А. Если да -
//возвращает внутренний полигон. Дальше циклически проходится от списка к списку собирая
//пересечения и внутренние вершины в полигоны согласно алгоритму. В конце проверяет
//превышает ли площадь каждого полученого полигона 0,0001 и исключает все полигоны меньшей площади.
function intersect(pol1,pol2) {
  var listA = intersectsTest(pol1, pol2);
  var listB = intersectsTest(pol2, pol1);
  //console.log(listA, listB);
  if(checkTotalIncluding(listA)) {
    if(checkPolygonArea(pol1)){
      return [pol1];
    } else {
      return [];
    }    
  };
  if(checkTotalIncluding(listB)) {
    if(checkPolygonArea(pol2)){
      return [pol2];
    } else {
      return [];
    }  
  };

  var startPoint = findOutIntersection(listA, pol2);
  var endPoint;
  var intPolygon = [];
  var sumOfUsedValues = [];
  while(checkIntersectionLeft(listA)) {
    intPolygon.push(collectPoints(startPoint, listA, listB));
    sumOfUsedValues = sumOfUsedValues.concat(collectPoints(startPoint, listA, listB));

    listA = filterListFromUsedValues(listA, sumOfUsedValues);
    listB = filterListFromUsedValues(listB, sumOfUsedValues);
    startPoint = findOutIntersection(listA, pol2);
 }

  intPolygon.forEach(function(pol,ind,self) {
    if(!checkPolygonArea(pol)) {
      self.splice(ind,1);
    }
  });

  return intPolygon;


}

//Функция проверки остаточных пересечений в списке. Данная функция будет прерывать бесконечный цикл
//в случае если все полигоны пересечения уже найдены
function checkIntersectionLeft(list) {
  var arr = [];
  for(var i = 0; i<list.length; i++) {
    if(list[i].intersection==='intersection') {
      return true;
    }
  }
  return false;
}

//В этой части кода мы собираем пересечения и внут. вершины согласно алгоритму. Когда мы циклически доходим
//до исходного пересечения start = end мы готовы вернуть целый многоугольник.
function collectPoints(startPoint, listA, listB) {
  var initailPoint = startPoint;
  var start = startPoint;
  var end;
  var result = [];
  while(end===undefined) {
    result = result.concat(collectPointsListA(start, listA, true));
    var index = result.length-1;
    start = result[index];

    result = result.concat(collectPointsListA(start, listB, true));
    var index = result.length-1;
    start = result[index];
    if(result[result.length-1].x === initailPoint.x&&result[result.length-1].y === initailPoint.y) {
      end = result[result.length-1];
      result.pop();
      result.unshift(initailPoint);
      return result;
    }
  }
}


//Функция для сбора точек в каждом конкретном списке, используется функцией више для получения конкретных кусков полигона пересечения.
function collectPointsListA(startPoint, listOne, noStart) {
  var start = startPoint;
  if(noStart) {
    var arr = []
  } else {
  var arr = [startPoint];
  }
  var index = getListIndex(start, listOne);
  var list = (listOne.slice(index+1,listOne.length)).concat(listOne.slice(0,index+1));
   for (var i = list.length-2; i >=0; i--) {
    if (list[i].intersection!==undefined) {
      arr.push(list[i]);
      return arr;
    } else if (list[i].vertex==='inside') {
      arr.push(list[i]);
    }
  }
}

//даная функция находит и возвращает индекс исходящей точки-аргументы в конкретном списке-аргументе.
function getListIndex(startPnt, list) {
  for(var i = 0; i <list.length; i++) {
    if(list[i].x===startPnt.x&&list[i].y===startPnt.y) {
      return i;
    }
  }
  return -1;
}

//Эта часть ответственна за маркирование использованых значений в списке.
function filterListFromUsedValues(list, usedValues) {
  var arr = [];
  function trackSamePoints(point, usedValues) {
    for(var i = 0; i < usedValues.length; i++) {
      if(point.x===usedValues[i].x&&point.y===usedValues[i].y) {
        return true;
      }
    }
    return false;
  }
  for(var i = 0; i < list.length; i++) {
    if(trackSamePoints(list[i], usedValues)) {
      if(list[i].intersection!==undefined){
        list[i].intersection='used';
      } else {
        list[i].vertex='used';
      }
      arr.push(list[i]);
    } else {
      arr.push(list[i]);
    }   
  }
  
  return arr;
}

//Даная функция находит первое пересечение в списке которое "выходит" из другого полигона.
function findOutIntersection(list, pol2) {
  for(var i = 0; i<list.length; i++) {
    if(list[i].intersection==='intersection') {
      if(!isIntersectInOrOutOfPolygon(i, list, pol2)) {
        return list[i];
      }
    }
  }
}

//функция для реверса массива(не знаю почему, но .reverse() не работал, пришлось сварить велосипед).
function myReverse(arr) {
  var reversedFig = [];
  for(var o = arr.length-1; o >=0; o--) {
    reversedFig.push(arr[o]);
  }
  return reversedFig;
}

//Данная функция принимает пересичение на грани полигона, и проверяет не пресекается ли эта грань еще раз.
//Функция рекурсивно вызывает сама себя пока не будут найдены и возвращены все пересичения на грани.
//Так же, в этой функции стоит парочка костылей, для исключения одинаковых точек.
function checkIfMoreIntersections(intersect, pointAStart, pointAEnd, poly) {
  var result = [intersect];
  var otherIntersection;
  for(var i = 0; i < poly.length; i++) {
    var pointBStart;
    var pointBEnd;
    var newIntersection;
    var oldIntersectionDistance;
    var newIntersectionDistance;
    pointBStart = poly[i];
    var nextIndex = (i + 1) % poly.length;
    pointBEnd = poly[nextIndex];
    
    
    if(checkLineIntersection(intersect, pointAStart, pointBStart, pointBEnd)){
      newIntersection = checkLineIntersection(intersect, pointAStart, pointBStart, pointBEnd); //intersect --> pointAStart
      otherIntersection = newIntersection;
      oldIntersectionDistance = Math.sqrt( (intersect.x-pointAStart.x)*(intersect.x-pointAStart.x) + (intersect.y-pointAStart.y)*(intersect.y-pointAStart.y) );
      newIntersectionDistance  = Math.sqrt( (newIntersection.x-pointAStart.x)*(newIntersection.x-pointAStart.x) + (newIntersection.y-pointAStart.y)*(newIntersection.y-pointAStart.y) );
      if(newIntersectionDistance<oldIntersectionDistance) {
        result.unshift(newIntersection);
      } else {
        result.push(newIntersection);
      }
    } 
  }

  //костыль
  if(otherIntersection!==undefined&&otherIntersection.x===intersect.x&&otherIntersection.y===intersect.y) {
    otherIntersection = undefined;
  }
  
  result.forEach(function(inter){
    inter.intersection = 'intersection';
  });
    if(otherIntersection!==undefined) {
      var moreIntersections = checkIfMoreIntersections(otherIntersection, pointAStart, pointAEnd, poly);
      result.concat(moreIntersections);
      //костыль
      result = result.filter(function(item, pos, self) {
        return self.indexOf(item) == pos;
      });
      
      result.unshift(pointAStart);
      result = result.sort(function (int1, int2)  {
        var val1 = Math.sqrt( (int1.x-result[0].x)*(int1.x-result[0].x) + (int1.y-result[0].y)*(int1.y-result[0].y) );
        var val2 = Math.sqrt( (int2.x-result[0].x)*(int2.x-result[0].x) + (int2.y-result[0].y)*(int2.y-result[0].y) );
        if (val1 < val2) return -1;
        else if (val1 > val2) return 1;
        else return 0;
      })
      

      return result;
    } else {
      return result;
   }

}

//Типичная функция для фильтрации одинаковых значений массива объектов.
//Также округляет значение x и y для точек до 3 знака (чтобы исключить случаи
//нахождения одного и того же пересечения с разными значениями, из-за погрешности
//счета бесконечной дроби)
function filterDuplicates(arr) {
  var arrResult = {};
  for (i = 0, n = arr.length; i < n; i++) {
      var item = arr[i];
      var itemX = item.x;
      itemX = itemX.toString();
      var indexX = itemX.indexOf('.');
      if(indexX > 0) {
        itemX = itemX.slice(0, indexX);
      }
      var itemY = item.y;
      itemY = itemY.toString();
      var indexY = itemY.indexOf('.');
      if(indexY > 0) {
        itemY = itemY.slice(0, indexY);
      }
      arrResult[ itemX + " - " + itemY ] = item;
  }

      var i = 0;
      var nonDuplicatedArray = [];    
  for(var item in arrResult) {
      var xCoor = arrResult[item].x;
      xCoor = xCoor.toString();
      var indX = xCoor.indexOf('.');
      if(indX > 0) {
        xCoor = xCoor.slice(0, indX+3);
      }
      arrResult[item].x = parseFloat(xCoor);

      var yCoor = arrResult[item].y;
      yCoor = yCoor.toString();
      var indY = yCoor.indexOf('.');
      if(indY > 0) {
        yCoor = yCoor.slice(0, indY+3);
      }
      arrResult[item].y = parseFloat(yCoor);

      nonDuplicatedArray[i++] = arrResult[item];
  }
  return nonDuplicatedArray;
}

//Проверяем является ли вершина пересичением или просто касанием с полигоном.
function checkDotIntersectionType(dot, prevDot, nextDot, linePointStart, LinePointEnd) {
    if(checkLineIntersection(prevDot, nextDot, linePointStart, LinePointEnd)){
      return true;
    } else {
      return false;
    }
}

//Проверяем находится ли точка-касание внутри противоположного полигона.
function checkTouchDot(dot, polCross) {
  result = false;
  for(var i = 0; i < polCross.length; i++) {
    var previousIndex = ( polCross.length + i - 1) % polCross.length;
    if(isPointBetweenPoints(dot, polCross[i], polCross[previousIndex])) {
      result = true;
    }
  }
  return result;

}

//Определяем характер пересичения (входящее или исходящее).
function isIntersectInOrOutOfPolygon(pointIndex, polygon, polCross) {
    var point = polygon[pointIndex];
    var previousIndex = (polygon.length + pointIndex - 1) % polygon.length;
    var previousPoint = polygon[previousIndex];

    var pointJustBeforeCurrent = {
        x: (point.x + previousPoint.x) / 2,
        y: (point.y + previousPoint.y) / 2
    };
  

    if(!isPointInPoly(polCross, pointJustBeforeCurrent)) {
      return true;
    } else {
      return false;
    }
}

//Функция проверки на полноем поглощение одного полигона другим.
function checkTotalIncluding (list) {
    var vertexiesOutside = [];
    var vertexiesInside = [];
    var intersections = [];
    list.forEach(function(point){
      if(point.vertex==='inside') {
        vertexiesInside.push(point);
      } else if (point.vertex==='outside') {
        vertexiesOutside.push(point);
      } else if (point.intersection==='intersection') {
        intersections.push(point);
      }
    });
    if(vertexiesOutside.length===0&&vertexiesInside.length>0&&intersections.length===0){
      return true;
    } else {
      return false;
    }
}

//Функция рассчета площади полигона и проверки соответсвия условию задания.
function checkPolygonArea(vertices) {
    var total = 0;

    for (var i = 0, l = vertices.length; i < l; i++) {
      var addX = vertices[i].x;
      var addY = vertices[i == vertices.length - 1 ? 0 : i + 1].y;
      var subX = vertices[i == vertices.length - 1 ? 0 : i + 1].x;
      var subY = vertices[i].y;

      total += (addX * addY * 0.5);
      total -= (subX * subY * 0.5);
    }
    var area = Math.abs(total);
    if(area > 0.0001) {
      return true;
    } else {
      return false;
    }
}