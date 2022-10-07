/* TODO: You can have different connection point radii based on whether they
are connected or not, but not differernt connection point label font sizes?
Either remove the ability to do this for the connection points or add it to 
the labels. Stay consistent! */

interface ITextStyle {
	/**
	 * The font family for a given text label.
	 */
	font: string;

	/**
	 * The font size for a given text label.
	 */
	size: number;

	/**
	 * The text colour for a given label.
	 */
	colour: string;
}

interface ITextTitleStyle extends ITextStyle {
	flowControlPadding: number;
}

interface IIndividualConnectionPointStyle {
	/**
	 * The radius of a connection point.
	 */
	radius: number;

	/**
	 * The colour of a connection point.
	 */
	colour: string;

	/**
	 * Style information about a connection point's border.
	 */
	border: {
		/**
		 * The width of a connection point's border.
		 */
		width: number;

		/**
		 * The colour of a connection point's border.
		 */
		colour: string;
	};

	flowControl: {
		/**
		 * The side lengths of the flow control triangle connection point.
		 */
		size: number;

		/**
		 * The colour of the flow control triangle connection point.
		 */
		colour: string;
	};
}

interface IIOStyle {
	/**
	 * The space between the title of a node and the first connection point
	 */
	titleToConnectionPointsPadding?: number;

	/**
	 * The space between each connection point on a node.
	 */
	interPadding: number;

	/**
	 * The space between a connection point and its label.
	 */
	pointToLabelPadding: number;

	/**
	 * Style information about connection point labels.
	 */
	labels: ITextStyle;

	/**
	 * Style information about connection points currently connected to another connection point.
	 */
	connected: IIndividualConnectionPointStyle;

	/**
	 * Style information about connection points not currently connected to another connection point.
	 */
	disconnected: IIndividualConnectionPointStyle;
}

export interface IStyle {
	/**
	 * Style information about a workspace itself.
	 */
	workspace: {
		/**
		 * Style information about a workspace's background.
		 */
		background: {
			/**
			 * The colour of a workspace's background. Also known as the clear colour.
			 */
			colour: string;
		};
	};

	/**
	 * Style information about nodes in a workspace.
	 */
	node: {
		/**
		 * The colour of a node's background.
		 */
		background: string;

		/**
		 * The colour of a node's background when it is selected.
		 */
		backgroundSelected: string;

		/**
		 * Style information about a node's border.
		 */
		border: {
			/**
			 * The width of a node's border.
			 */
			width: number;

			/**
			 * The colour of a node's border.
			 */
			colour: string;
		};

		/**
		 * The space between the edges of a node and the elements within it.
		 */
		padding: number;

		/**
		 * Style information about a node's title.
		 */
		title: ITextTitleStyle;

		/**
		 * Style information about a node's input connection points.
		 */
		inputs: IIOStyle;

		/**
		 * Style information about a node's output connection points.
		 */
		outputs: IIOStyle;

		/**
		 * The width of a node.
		 */
		width: number;
	};

	/**
	 * Style information about connection lines between nodes in a workspace.
	 */
	connectionLine: {
		//TODO: describe this better.
		/**
		 * How curvy the curve is.
		 */
		curviness: number;

		/**
		 * The width of a connection line.
		 */
		width: number;
	};
}
