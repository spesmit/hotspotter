(function (angular, undefined) {
	var module = angular.module('AxelSoft', []);

	module.value('treeViewDefaults', {
		foldersProperty: 'folders',
		filesProperty: 'files',
		displayProperty: 'name',
		scoreProperty: 'score',
		collapsible: true,
	}
	);

	module.directive('treeView', ['$q', 'treeViewDefaults', function ($q, treeViewDefaults) {

		return {
			restrict: 'A',
			scope: {
				treeView: '=treeView',
				treeViewOptions: '=treeViewOptions',
				treeIndex: '=treeIndex'
			},
			replace: true,
			template:
				'<div class="tree">' +
					'<div>' +
						'<button class="btn btn-primary" ng-disabled="first" ng-click="decrement()">&lt;</button>' +
						'<span> Snapshot: {{ treeIndex + 1 }} </span>' +
			        	'<button class="btn btn-primary" ng-disabled="last" ng-click="increment()">&gt;</button>' +
					'</div>' +
					'<div tree-view-node="treeView">' +
					'</div>' +
				'</div>',

			controller: ['$scope', function ($scope) {
				var self = this,
					selectedNode,
					selectedFile;

				var options = angular.extend({}, treeViewDefaults, $scope.treeViewOptions);

				$scope.total = $scope.treeIndex;

				if ($scope.treeIndex === 0) {
					$scope.last = true;
					$scope.first = true;
				} else {
					$scope.last = true;
					$scope.first = false;
				}

				self.selectNode = function (node, breadcrumbs) {
					if (selectedFile) {
						selectedFile = undefined;
					}
					selectedNode = node;

					if (typeof options.onNodeSelect === "function") {
						options.onNodeSelect(node, breadcrumbs);
					}
				};

				self.selectFile = function (file, breadcrumbs) {
					if (selectedNode) {
						selectedNode = undefined;
					}
					selectedFile = file;

					if (typeof $scope.treeViewOptions.onFileSelect === "function") {
						$scope.treeViewOptions.onFileSelect(file, breadcrumbs);
					}
				};

				self.isSelected = function (node) {
					return node === selectedNode || node === selectedFile;
				};

				/*
				self.addNode = function (event, name, parent) {
					if (typeof options.onAddNode === "function") {
						options.onAddNode(event, name, parent);
					}
				};
				self.removeNode = function (node, index, parent) {
					if (typeof options.onRemoveNode === "function") {
						options.onRemoveNode(node, index, parent);
					}
				};

				self.renameNode = function (event, node, name) {
					if (typeof options.onRenameNode === "function") {
						return options.onRenameNode(event, node, name);
					}
					return true;
				};
				*/

				self.getOptions = function () {
					return options;

				};
			}]

		};
	}]);

	module.directive('treeViewNode', ['$q', '$compile', function ($q, $compile) {
		return {
			restrict: 'A',
			require: '^treeView',
			link: function (scope, element, attrs, controller) {

				var options = controller.getOptions(),
					foldersProperty = options.foldersProperty,
					filesProperty = options.filesProperty,
					displayProperty = options.displayProperty,
					scoreProperty = options.scoreProperty,
					collapsible = options.collapsible;
				//var isEditing = false;
				scope.expanded = collapsible === false;

				scope.getFolderIconClass = function () {
					return 'icon-folder' + (scope.expanded && scope.hasChildren() ? '-open' : '');
				};

				scope.getFileIconClass = typeof options.mapIcon === 'function' ?
					 options.mapIcon
					: function (file) {
						return 'icon-file';
					};

				scope.hasChildren = function () {
					var node = scope.node;
					return Boolean(node && (node[foldersProperty] && node[foldersProperty].length) || (node[filesProperty] && node[filesProperty].length));
				};

				scope.selectNode = function (event) {
					event.preventDefault();
					//if (isEditing) return;

					if (collapsible) {
						toggleExpanded();
					}

					var breadcrumbs = [];
					var nodeScope = scope;
					while (nodeScope.node) {
						breadcrumbs.push(nodeScope.node[displayProperty]);
						nodeScope = nodeScope.$parent;
					}
					controller.selectNode(scope.node, breadcrumbs.reverse());
				};

				scope.selectFile = function (file, event) {
					event.preventDefault();
					//if (isEditing) return;
					console.log(file);
					var breadcrumbs = [file[displayProperty]];
					var nodeScope = scope;
					while (nodeScope.node) {
						breadcrumbs.push(nodeScope.node[displayProperty]);
						nodeScope = nodeScope.$parent;
						console.log(breadcrumbs);
					}
					controller.selectFile(file, breadcrumbs.reverse());
				};

				scope.isSelected = function (node) {
					return controller.isSelected(node);
				};

				
				scope.increment = function () {
					scope.treeIndex++;
					if (scope.treeIndex > scope.total-1)
						scope.last = true;
					else
						scope.first = false;

				};

				scope.decrement = function () {
					scope.treeIndex--;
					if (scope.treeIndex < 1)
						scope.first = true;
					else
						scope.last = false;

				};

				function toggleExpanded() {
					//if (!scope.hasChildren()) return;
					scope.expanded = !scope.expanded;
				}

				function render() {
					var template =
						'<div class="tree-folder" ng-repeat="node in ' + attrs.treeViewNode + '.' + foldersProperty + '">' +
							'<a href="#" class="tree-folder-header inline" ng-click="selectNode($event)" ng-class="{ selected: isSelected(node) }">' +
								'<i class="icon-folder-close" ng-class="getFolderIconClass()"></i> ' +
								'<span class="tree-folder-name">{{ node.' + displayProperty +  ' }}</span> ' +
							'</a>' +
							'<div class="tree-folder-content"'+ (collapsible ? ' ng-show="expanded"' : '') + '>' +
								'<div tree-view-node="node">' +
								'</div>' +
							'</div>' +
						'</div>' +
						'<a href="#" style="background: hsl({{ (file.' + scoreProperty + '[treeIndex].Score)*150 }},80%,50%)" class="tree-item" ng-repeat="file in ' + attrs.treeViewNode + '.' + filesProperty + '" ng-click="selectFile(file, $event)" ng-class="{ selected: isSelected(file) }">' +
							'<span class="tree-item-name"><i ng-class="getFileIconClass(file)"></i> {{ file.' + displayProperty + ' }}</span>' +
						'</a>';
					//Rendering template.
					element.html('').append($compile(template)(scope));
				}

				render();
			}
		};
	}]);
})(angular);
