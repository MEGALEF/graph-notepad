function Controller($scope, $http) {
    $scope.tags = "";

    $scope.create = function (text) {
        $scope.note = {
            text: ($scope.text) ? $scope.text : "",
            tags: ($scope.tags) ? $scope.tags : ""
        };


        var batchdata = [];

        batchdata.push({
            method: "POST",
            to: "/cypher",
            id: 0,
            body: {
                query:"create (n:Note {data:{text}})",
                params:{
                    text: $scope.note.text
                }
            }
        });

        for (i = 0; i < $scope.note.tags.length; i++) {
            batchdata.push(
                {
                method: "POST",
                to: "/index/node/root?uniqueness=get_or_create",
                id: batchdata.length,
                body: {
                    key: "data",
                    value: $scope.note.tags[i],
                    properties: {
                        data: $scope.note.tags[i]
                    }
                }
            }
            );
            batchdata.push({
                    method: "POST",
                    to: "/cypher",
                    id: batchdata.length,
                    body: {
                        query: "match (tag {data:{tag}}), (note:Note {data:{text}}) create note-[:is]->tag",
                        params: {
                            tag: $scope.note.tags[i],
                            text: $scope.note.text
                        }
                    }
    });
        }

//            batchdata.push({
//                method: "POST",
//                to: "/{" + (batchdata.length - 1) + "}/relationships",
//                body: {
//                    to: "{0}",
//                    type: "is"
//                },
//                id: batchdata.length
//            });
        //}

        $http.post('http://localhost:7474/db/data/batch',
                batchdata)
            .success(function (data, status, headers, config) {
                $scope.completeNode(data, headers, config);
            });
    };

    $scope.completeNode = function (data, headers, config) {
        alert("hej");
    };

    $scope.update = function (text) {
        var rex = /\B#\w*[a-zA-Z]+\w*/g;
        $scope.tags = text.match(rex);
    }
}