var socket = io();

angular.module('chatApp', ['ngCookies'])
    .directive('posttext', function () {
        return {
            restrict: 'EAC',
            link: function ($scope, $ele, $atr) {
                $scope.$on('new msg', function (d, newValue) {
                    var title = newValue.userName;
                    var body = newValue.msg;
                    var msgType = 'is-info';

                    if (newValue) {
                        switch (newValue) {
                            case 'transport close':
                                title = '服务器';
                                body = '服务器中断， 请等待.....';
                                msgType = 'is-danger';
                                break;
                            default:
                        }

                        if (newValue.userId === 0) {
                            msgType = 'is-warning';
                        } else if (title == $scope.localUserName) {
                            msgType = 'is-success';
                        }

                        var template = '<span class="tag ' + msgType + '"><span class="talk-name">' + title + '</span>：' + body + '</span><br /><br />';

                        $ele.append(template);

                        $ele[0].scrollTop = $ele[0].scrollHeight;
                    }
                });
            }
        }
    })
    .directive('userlist', function () {
        return {
            restrict: 'EAC',
            link: function ($scope, $ele, $atr) {
                $ele.append('<p class="menu-heading">用户列表</p>');
                $scope.$on('user list', function (d, newValue) {
                    if (newValue) {
                        $ele.html('');
                        $ele.append('<p class="menu-heading">用户列表</p>');

                        for (i in newValue) {
                            $ele.append('<a class="menu-block is-active" href="javascript:;"><span class="menu-icon">&hearts;</span>' + newValue[i].userName + '</a>');
                        }
                    }
                });
            }
        }
    })
    .controller('chatMainCtrl', ['$scope', '$interval', '$cookies', function ($scope, $interval, $cookies) {
        $scope.postText = '';
        $scope.userList = [];
        $scope.event = this;
        $scope.newName = parseInt(Math.random() * 90000 + 10000) + '';
        $scope.localUserName = $scope.newName;
        $scope.isShowDialog = false;
        $scope.dialogContent = '';

        $scope.postSentEvent = function () {
            var postText = $scope.postText;
            if (postText.replace(/ /ig, '').length == 0) {
                $scope.dialogContent = '请输入要发送的信息。';
                $scope.isShowDialog = true;
                return false;
            }

            socket.emit('chat message', $scope.postText);
            $scope.postText = '';

            return false;
        };

        $scope.postTextKeydownEvent = function () {
            if ($scope.event.keyCode == 13) {
                $scope.postSentEvent();
            }
        };

        $scope.renameEvent = function () {
            if ($scope.newName.replace(/ /ig, '')) {
                socket.emit('change name', {
                    newName: $scope.newName
                });
            }

            $scope.localUserName = $scope.newName;

            $scope.newName = '';
        };

        $scope.renameEvent();

        $scope.closeDialog = function () {
            $scope.isShowDialog = false;
        };

        socket.on('chat message', function (msg) {
            $scope.$emit('new msg', msg);

            return false;
        });

        socket.on('disconnect', function (msg) {
            $scope.$emit('new msg', msg);

            return false;
        });

        socket.on('user list', function (msg) {
            $scope.$emit('user list', msg);

            return false;
        });

    }]);
